"use client"

import { formulaFromInchi } from "./chemistry"

export type RDKitMol = {
  get_smiles: () => string
  get_cxsmiles?: () => string
  get_inchi?: () => string
  get_molblock?: (details?: string) => string
  get_svg?: (width?: number, height?: number) => string
  get_svg_with_highlights?: (details?: string) => string
  get_descriptors?: () => string
  get_substruct_match?: (query: RDKitMol) => string
  get_substruct_matches?: (query: RDKitMol) => string
  get_morgan_fp_as_uint8array?: (details?: string) => Uint8Array
  delete: () => void
}

export type RDKitModule = {
  version?: () => string
  get_mol: (input: string, details?: string) => RDKitMol | null
  get_qmol: (smarts: string) => RDKitMol | null
  get_inchikey_for_inchi?: (inchi: string) => string
}

declare global {
  interface Window {
    initRDKitModule?: (options?: { locateFile?: (path: string) => string }) => Promise<RDKitModule>
    __openlabRdkit?: Promise<RDKitModule>
  }
}

export type RDKitAnalysis = {
  canonicalSmiles: string
  cxsmiles: string
  inchi: string
  inchiKey: string
  formula: string
  molblock: string
  svg: string
  descriptors: Record<string, number>
  fingerprint: Uint8Array
}

function loadScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.initRDKitModule) { resolve(); return }
    const existing = document.querySelector<HTMLScriptElement>('script[data-openlab-rdkit="true"]')
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("RDKit.js failed to load.")), { once: true })
      return
    }
    const script = document.createElement("script")
    script.src = "/rdkit/RDKit_minimal.js"
    script.async = true
    script.dataset.openlabRdkit = "true"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("RDKit.js runtime was not found. Reinstall dependencies so OpenLab can copy the RDKit WASM assets."))
    document.head.appendChild(script)
  })
}

export async function loadRDKit(): Promise<RDKitModule> {
  if (typeof window === "undefined") throw new Error("RDKit is available only in the browser.")
  if (!window.__openlabRdkit) {
    window.__openlabRdkit = (async () => {
      await loadScript()
      if (!window.initRDKitModule) throw new Error("RDKit.js loaded but did not expose initRDKitModule.")
      return window.initRDKitModule({ locateFile: file => file.endsWith(".wasm") ? "/rdkit/RDKit_minimal.wasm" : `/rdkit/${file}` })
    })().catch(error => {
      window.__openlabRdkit = undefined
      throw error
    })
  }
  return window.__openlabRdkit
}

function safeJson(value: string | undefined) {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === "object") return parsed as Record<string, number>
  } catch { /* RDKit reports invalid data separately. */ }
  return {}
}

export async function analyzeWithRDKit(input: string): Promise<RDKitAnalysis> {
  const module = await loadRDKit()
  const mol = module.get_mol(input)
  if (!mol) throw new Error("RDKit could not parse this structure. Check the SMILES, MOL block, or SDF record.")
  try {
    const canonicalSmiles = mol.get_smiles()
    const cxsmiles = mol.get_cxsmiles?.() || ""
    const inchi = mol.get_inchi?.() || ""
    const inchiKey = inchi && module.get_inchikey_for_inchi ? module.get_inchikey_for_inchi(inchi) : ""
    const molblock = mol.get_molblock?.() || ""
    const svg = mol.get_svg?.(520, 340) || ""
    const descriptors = safeJson(mol.get_descriptors?.())
    const fingerprint = mol.get_morgan_fp_as_uint8array?.(JSON.stringify({ radius: 2, fplen: 2048 })) || new Uint8Array()
    return { canonicalSmiles, cxsmiles, inchi, inchiKey, formula: formulaFromInchi(inchi), molblock, svg, descriptors, fingerprint }
  } finally {
    mol.delete()
  }
}

export async function fingerprintWithRDKit(input: string) {
  const module = await loadRDKit()
  const mol = module.get_mol(input)
  if (!mol) throw new Error("Invalid molecular structure")
  try {
    return mol.get_morgan_fp_as_uint8array?.(JSON.stringify({ radius: 2, fplen: 2048 })) || new Uint8Array()
  } finally { mol.delete() }
}

export async function substructureMatchWithRDKit(input: string, smarts: string) {
  const module = await loadRDKit()
  const mol = module.get_mol(input)
  const query = module.get_qmol(smarts)
  if (!mol || !query) {
    mol?.delete(); query?.delete()
    throw new Error("RDKit could not parse the molecule or SMARTS query.")
  }
  try {
    const raw = mol.get_substruct_match?.(query) || "{}"
    let match: { atoms?: number[]; bonds?: number[] } = {}
    try { match = JSON.parse(raw) } catch { match = {} }
    let svg = ""
    if (match.atoms?.length && mol.get_svg_with_highlights) {
      svg = mol.get_svg_with_highlights(JSON.stringify({ width: 420, height: 260, atoms: match.atoms, bonds: match.bonds || [] }))
    }
    return { matched: Boolean(match.atoms?.length), match, svg }
  } finally {
    query.delete(); mol.delete()
  }
}

export async function rdkitVersion() {
  const module = await loadRDKit()
  try { return module.version?.() || "RDKit.js" } catch { return "RDKit.js" }
}
