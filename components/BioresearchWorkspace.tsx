"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { makeId } from "@/lib/id"
import { storage } from "@/lib/storage"
import type { AssayRun, WorkspaceState } from "@/lib/types"
import { BookIcon, DnaIcon, RegistryIcon, SparkIcon } from "./Icons"

function freshAssay(): AssayRun {
  return { id: makeId("assay"), name: "Untitled assay", assayType: "Assay", projectId: null, status: "Draft", measurements: [], updatedAt: new Date().toISOString() }
}

export default function BioresearchWorkspace() {
  const [state, setState] = useState<WorkspaceState | null>(null)
  const [activeId, setActiveId] = useState("")

  const refresh = () => {
    const next = storage.getState()
    setState(next)
    setActiveId(current => current && next.assayRuns.some(item => item.id === current) ? current : (next.assayRuns[0]?.id || ""))
  }

  useEffect(() => {
    refresh()
    window.addEventListener(storage.eventName, refresh)
    return () => window.removeEventListener(storage.eventName, refresh)
  }, [])

  const assay = state?.assayRuns.find(item => item.id === activeId)
  const mean = useMemo(() => {
    if (!assay?.measurements.length) return null
    return assay.measurements.reduce((sum, item) => sum + Number(item.value || 0), 0) / assay.measurements.length
  }, [assay])

  function save(next: AssayRun) {
    storage.saveAssayRun({ ...next, updatedAt: new Date().toISOString() })
  }

  function createAssay() {
    const next = freshAssay()
    storage.saveAssayRun(next)
    setActiveId(next.id)
  }

  function addMeasurement() {
    if (!assay) return
    save({ ...assay, measurements: [...assay.measurements, { id: makeId("measurement"), sample: "Sample", metric: "Response", value: 0, unit: "" }] })
  }

  return <div className="applicationWorkspace">
    <div className="applicationHero">
      <div><div className="sectionEyebrow">BIORESEARCH</div><h1>Design experiments and capture structured assay data</h1><p>This is now a working application surface, not a renamed link. Assay results save into the same OpenLab workspace and sync with Supabase snapshots.</p></div>
      <button className="primaryButton" onClick={createAssay}>+ New assay run</button>
    </div>

    <div className="applicationQuickLinks">
      <Link href="/notebook"><BookIcon size={18}/><span><strong>Notebook</strong><small>Experiment records</small></span></Link>
      <Link href="/plasmids"><DnaIcon size={18}/><span><strong>Molecular design</strong><small>DNA, primers, annotations</small></span></Link>
      <Link href="/registry"><RegistryIcon size={18}/><span><strong>Registry</strong><small>Biological entities</small></span></Link>
      <Link href="/sources"><SparkIcon size={18}/><span><strong>Scientific evidence</strong><small>Source-grounded research</small></span></Link>
    </div>

    <div className="applicationSplit">
      <aside className="applicationList">
        <div className="applicationListHead"><strong>Assay runs</strong><span>{state?.assayRuns.length || 0}</span></div>
        {(state?.assayRuns || []).map(item => <button className={item.id === activeId ? "active" : ""} key={item.id} onClick={() => setActiveId(item.id)}><strong>{item.name}</strong><span>{item.assayType} · {item.status}</span></button>)}
      </aside>

      <main className="applicationEditor">
        {!assay ? <div className="emptyState"><strong>Create an assay run</strong><p>Capture structured samples, metrics and numerical results.</p></div> : <>
          <div className="applicationEditorHead">
            <div><input className="applicationTitleInput" value={assay.name} onChange={event => save({ ...assay, name: event.target.value })}/><span>Last updated {new Date(assay.updatedAt).toLocaleString()}</span></div>
            <div className="applicationHeadControls"><select value={assay.status} onChange={event => save({ ...assay, status: event.target.value as AssayRun["status"] })}><option>Draft</option><option>Running</option><option>Complete</option></select><button className="dangerGhost" onClick={() => { storage.deleteAssayRun(assay.id); setActiveId("") }}>Delete</button></div>
          </div>

          <div className="applicationMetaGrid">
            <label><span>Assay type</span><input value={assay.assayType} onChange={event => save({ ...assay, assayType: event.target.value })}/></label>
            <label><span>Project</span><select value={assay.projectId || ""} onChange={event => save({ ...assay, projectId: event.target.value || null })}><option value="">Unassigned</option>{state?.projects.map(project => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label>
            <div className="assaySummary"><span>Rows</span><strong>{assay.measurements.length}</strong></div>
            <div className="assaySummary"><span>Mean</span><strong>{mean === null ? "—" : mean.toFixed(2)}</strong></div>
          </div>

          <section className="structuredTableCard">
            <div className="tableToolbar"><strong>Structured assay results</strong><button className="ghostButton" onClick={addMeasurement}>+ Add row</button></div>
            <div className="assayDataHead"><span>Sample</span><span>Metric</span><span>Value</span><span>Unit</span><span/></div>
            {assay.measurements.map(row => <div className="assayDataRow" key={row.id}>
              <input value={row.sample} onChange={event => save({ ...assay, measurements: assay.measurements.map(item => item.id === row.id ? { ...item, sample: event.target.value } : item) })}/>
              <input value={row.metric} onChange={event => save({ ...assay, measurements: assay.measurements.map(item => item.id === row.id ? { ...item, metric: event.target.value } : item) })}/>
              <input type="number" value={row.value} onChange={event => save({ ...assay, measurements: assay.measurements.map(item => item.id === row.id ? { ...item, value: Number(event.target.value) } : item) })}/>
              <input value={row.unit} onChange={event => save({ ...assay, measurements: assay.measurements.map(item => item.id === row.id ? { ...item, unit: event.target.value } : item) })}/>
              <button onClick={() => save({ ...assay, measurements: assay.measurements.filter(item => item.id !== row.id) })}>×</button>
            </div>)}
            {!assay.measurements.length && <div className="analysisEmpty">Add a result row to begin structured data capture.</div>}
          </section>
        </>}
      </main>
    </div>
  </div>
}
