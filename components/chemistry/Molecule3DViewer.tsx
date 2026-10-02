"use client"

import { useEffect, useRef, useState } from "react"

type ViewerStyle = "stick" | "sphere" | "line" | "cartoon"
type SupportedFormat = "pdb" | "sdf" | "mol2" | "xyz" | "cif" | "mol"

export default function Molecule3DViewer({ data, format, style = "stick", spin = false }: { data: string; format: SupportedFormat; style?: ViewerStyle; spin?: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<any>(null)
  const [message, setMessage] = useState("Loading 3Dmol.js…")

  useEffect(() => {
    let cancelled = false
    let resize: ResizeObserver | null = null
    async function render() {
      if (!hostRef.current || !data.trim()) { setMessage("Paste or upload molecular coordinates to begin."); return }
      setMessage("Loading 3Dmol.js…")
      try {
        const imported: any = await import("3dmol/build/3Dmol.js")
        if (cancelled || !hostRef.current) return
        const $3Dmol = imported.default || imported
        hostRef.current.innerHTML = ""
        const viewer = $3Dmol.createViewer(hostRef.current, { backgroundColor: "white", antialias: true })
        viewerRef.current = viewer
        viewer.addModel(data, format === "mol" ? "sdf" : format)
        if (style === "cartoon") viewer.setStyle({}, { cartoon: { color: "spectrum" }, stick: { radius: 0.12 } })
        if (style === "sphere") viewer.setStyle({}, { sphere: { scale: 0.3 }, stick: { radius: 0.08 } })
        if (style === "line") viewer.setStyle({}, { line: {} })
        if (style === "stick") viewer.setStyle({}, { stick: { radius: 0.18 } })
        viewer.zoomTo()
        viewer.render()
        viewer.spin(spin ? "y" : false)
        resize = new ResizeObserver(() => viewer.resize())
        resize.observe(hostRef.current)
        setMessage("")
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "3D viewer failed to initialize.")
      }
    }
    render()
    return () => {
      cancelled = true
      resize?.disconnect()
      try { viewerRef.current?.spin(false); viewerRef.current?.clear() } catch { /* viewer cleanup */ }
      viewerRef.current = null
    }
  }, [data, format, style, spin])

  return <div className="chem3dFrame">
    <div ref={hostRef} className="chem3dCanvas" />
    {message && <div className="chem3dMessage">{message}</div>}
  </div>
}
