import type { ChemistryCompound, ChemistryDescriptorMap } from "./types"

export type ImportedStructure = {
  name: string
  input: string
  format: "SMILES" | "MOL" | "SDF" | "CSV" | "Manual"
}

export type ScreeningRules = {
  maxMw: number
  maxLogP: number
  maxTpsa: number
  maxHbd: number
  maxHba: number
  maxRotatable: number
}

export const defaultScreeningRules: ScreeningRules = {
  maxMw: 500,
  maxLogP: 5,
  maxTpsa: 140,
  maxHbd: 5,
  maxHba: 10,
  maxRotatable: 10,
}

export function descriptorValue(descriptors: ChemistryDescriptorMap, ...keys: string[]) {
  for (const key of keys) {
    const value = descriptors[key]
    if (typeof value === "number" && Number.isFinite(value)) return value
  }
  return null
}

export function descriptorSummary(descriptors: ChemistryDescriptorMap) {
  return {
    mw: descriptorValue(descriptors, "amw", "MolWt", "molecularWeight"),
    exactMw: descriptorValue(descriptors, "exactmw", "ExactMolWt"),
    logP: descriptorValue(descriptors, "CrippenClogP", "MolLogP", "logP"),
    tpsa: descriptorValue(descriptors, "tpsa", "TPSA"),
    hbd: descriptorValue(descriptors, "NumHBD", "lipinskiHBD"),
    hba: descriptorValue(descriptors, "NumHBA", "lipinskiHBA"),
    rotatable: descriptorValue(descriptors, "NumRotatableBonds"),
    rings: descriptorValue(descriptors, "NumRings"),
    aromaticRings: descriptorValue(descriptors, "NumAromaticRings"),
    fractionCsp3: descriptorValue(descriptors, "FractionCSP3"),
  }
}

export function screenCompound(compound: ChemistryCompound, rules = defaultScreeningRules) {
  const d = descriptorSummary(compound.descriptors)
  const checks = [
    { key: "MW", value: d.mw, limit: rules.maxMw, label: `MW ≤ ${rules.maxMw}` },
    { key: "cLogP", value: d.logP, limit: rules.maxLogP, label: `cLogP ≤ ${rules.maxLogP}` },
    { key: "TPSA", value: d.tpsa, limit: rules.maxTpsa, label: `TPSA ≤ ${rules.maxTpsa} Å²` },
    { key: "HBD", value: d.hbd, limit: rules.maxHbd, label: `HBD ≤ ${rules.maxHbd}` },
    { key: "HBA", value: d.hba, limit: rules.maxHba, label: `HBA ≤ ${rules.maxHba}` },
    { key: "RotB", value: d.rotatable, limit: rules.maxRotatable, label: `Rotatable bonds ≤ ${rules.maxRotatable}` },
  ]
  const known = checks.filter(item => item.value !== null)
  const failures = known.filter(item => Number(item.value) > item.limit)
  const lipinskiKnown = [d.mw, d.logP, d.hbd, d.hba].every(value => value !== null)
  const lipinskiViolations = [
    d.mw !== null && d.mw > 500,
    d.logP !== null && d.logP > 5,
    d.hbd !== null && d.hbd > 5,
    d.hba !== null && d.hba > 10,
  ].filter(Boolean).length
  const veberKnown = d.rotatable !== null && d.tpsa !== null
  const veberPass = veberKnown ? Number(d.rotatable) <= 10 && Number(d.tpsa) <= 140 : null
  return {
    checks,
    failures,
    complete: known.length === checks.length,
    pass: known.length === checks.length ? failures.length === 0 : null,
    lipinskiViolations: lipinskiKnown ? lipinskiViolations : null,
    veberPass,
  }
}

export function formulaFromInchi(inchi: string) {
  if (!inchi.startsWith("InChI=")) return ""
  const parts = inchi.split("/")
  return parts[1] || ""
}

const popCount = (() => {
  const table = new Uint8Array(256)
  for (let i = 0; i < 256; i += 1) {
    let n = i
    let count = 0
    while (n) { count += n & 1; n >>>= 1 }
    table[i] = count
  }
  return table
})()

export function tanimotoBytes(a: Uint8Array, b: Uint8Array) {
  const length = Math.min(a.length, b.length)
  let intersection = 0
  let union = 0
  for (let i = 0; i < length; i += 1) {
    intersection += popCount[a[i] & b[i]]
    union += popCount[a[i] | b[i]]
  }
  return union ? intersection / union : 0
}

export function extractMolBlockFromSdfRecord(record: string) {
  const lines = record.replace(/\r/g, "").split("\n")
  const endIndex = lines.findIndex(line => line.trim() === "M  END")
  return (endIndex >= 0 ? lines.slice(0, endIndex + 1) : lines).join("\n").trim()
}

export function splitSdf(text: string): ImportedStructure[] {
  return text.split(/\$\$\$\$/).map(record => record.trim()).filter(Boolean).map((record, index) => {
    const molblock = extractMolBlockFromSdfRecord(record)
    const name = molblock.split(/\r?\n/)[0]?.trim() || `SDF compound ${index + 1}`
    return { name, input: molblock, format: "SDF" as const }
  })
}

function parseCsvLine(line: string) {
  const out: string[] = []
  let current = ""
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1 }
      else quoted = !quoted
    } else if (ch === "," && !quoted) {
      out.push(current.trim()); current = ""
    } else current += ch
  }
  out.push(current.trim())
  return out
}

export function parseSmilesOrCsv(text: string, filename = "") : ImportedStructure[] {
  const lines = text.replace(/\r/g, "").split("\n").filter(line => line.trim() && !line.trim().startsWith("#"))
  if (!lines.length) return []
  const looksCsv = filename.toLowerCase().endsWith(".csv") || lines[0].includes(",")
  if (looksCsv) {
    const headers = parseCsvLine(lines[0]).map(item => item.toLowerCase())
    const smilesIndex = headers.findIndex(item => ["smiles", "canonical_smiles", "canonical smiles", "structure"].includes(item))
    const nameIndex = headers.findIndex(item => ["name", "compound", "compound_name", "title", "id"].includes(item))
    if (smilesIndex >= 0) {
      return lines.slice(1).map((line, index) => {
        const row = parseCsvLine(line)
        return { name: row[nameIndex] || `Compound ${index + 1}`, input: row[smilesIndex] || "", format: "CSV" as const }
      }).filter(item => item.input)
    }
  }
  return lines.map((line, index) => {
    const tabParts = line.split(/\t+/)
    if (tabParts.length > 1) return { name: tabParts.slice(1).join(" ").trim() || `Compound ${index + 1}`, input: tabParts[0].trim(), format: "SMILES" as const }
    const space = line.search(/\s+/)
    if (space > 0) return { name: line.slice(space).trim() || `Compound ${index + 1}`, input: line.slice(0, space).trim(), format: "SMILES" as const }
    return { name: `Compound ${index + 1}`, input: line.trim(), format: "SMILES" as const }
  }).filter(item => item.input)
}

export function inferStructureFile(text: string, filename: string): ImportedStructure[] {
  const lower = filename.toLowerCase()
  if (lower.endsWith(".sdf")) return splitSdf(text)
  if (lower.endsWith(".mol") || lower.endsWith(".molfile")) return [{ name: text.split(/\r?\n/)[0]?.trim() || filename.replace(/\.[^.]+$/, ""), input: text, format: "MOL" }]
  return parseSmilesOrCsv(text, filename)
}

function csvCell(value: unknown) {
  const text = String(value ?? "")
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function compoundsToCsv(compounds: ChemistryCompound[]) {
  const header = ["id", "name", "canonical_smiles", "inchi", "inchikey", "formula", "series", "tags", "mw", "clogp", "tpsa", "hbd", "hba", "rotatable_bonds"]
  const rows = compounds.map(compound => {
    const d = descriptorSummary(compound.descriptors)
    return [compound.id, compound.name, compound.canonicalSmiles || compound.smiles, compound.inchi, compound.inchiKey, compound.formula, compound.series, compound.tags.join(";"), d.mw ?? "", d.logP ?? "", d.tpsa ?? "", d.hbd ?? "", d.hba ?? "", d.rotatable ?? ""]
  })
  return [header, ...rows].map(row => row.map(csvCell).join(",")).join("\n")
}

export function compoundsToSdf(compounds: ChemistryCompound[]) {
  return compounds.filter(item => item.molblock).map(item => {
    const props = [
      ["OPENLAB_ID", item.id], ["NAME", item.name], ["SMILES", item.canonicalSmiles || item.smiles],
      ["INCHIKEY", item.inchiKey], ["SERIES", item.series], ["TAGS", item.tags.join(";")],
    ].filter(([, value]) => value)
    return `${item.molblock.trim()}\n${props.map(([key, value]) => `>  <${key}>\n${value}\n`).join("\n")}\n$$$$`
  }).join("\n")
}

export function downloadText(filename: string, text: string, type = "text/plain;charset=utf-8") {
  if (typeof document === "undefined") return
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function computeReactionMassMg(amountMmol: number | null, molecularWeight: number | null) {
  if (amountMmol === null || molecularWeight === null || !Number.isFinite(amountMmol) || !Number.isFinite(molecularWeight)) return null
  return amountMmol * molecularWeight
}

export function computeVolumeUl(massMg: number | null, densityGPerMl: number | null) {
  if (massMg === null || densityGPerMl === null || densityGPerMl <= 0 || !Number.isFinite(massMg)) return null
  return massMg / densityGPerMl
}

export function computeYieldPercent(actualMg: number | null, theoreticalMg: number | null) {
  if (actualMg === null || theoreticalMg === null || theoreticalMg <= 0) return null
  return actualMg / theoreticalMg * 100
}
