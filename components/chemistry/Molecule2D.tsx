"use client"

export default function Molecule2D({ svg, alt = "2D molecular structure", compact = false }: { svg: string; alt?: string; compact?: boolean }) {
  if (!svg) return <div className={`chem2dEmpty ${compact ? "compact" : ""}`}><span>2D structure</span><small>Analyze with RDKit to render.</small></div>
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  return <div className={`chem2dImage ${compact ? "compact" : ""}`}><img src={src} alt={alt}/></div>
}
