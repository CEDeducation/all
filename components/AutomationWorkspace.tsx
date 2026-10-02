"use client"

import { useEffect, useState } from "react"
import { makeId } from "@/lib/id"
import { storage } from "@/lib/storage"
import type { AutomationFlow, AutomationNodeType, WorkspaceState } from "@/lib/types"

const nodeTypes: AutomationNodeType[] = ["Instrument input", "Transform", "Analysis", "Decision", "Notebook output"]

export default function AutomationWorkspace() {
  const [state, setState] = useState<WorkspaceState | null>(null)
  const [activeId, setActiveId] = useState("")
  const [nodeType, setNodeType] = useState<AutomationNodeType>("Instrument input")

  const refresh = () => { const next = storage.getState(); setState(next); setActiveId(current => current && next.automationFlows.some(item => item.id === current) ? current : (next.automationFlows[0]?.id || "")) }
  useEffect(() => { refresh(); window.addEventListener(storage.eventName, refresh); return () => window.removeEventListener(storage.eventName, refresh) }, [])
  const flow = state?.automationFlows.find(item => item.id === activeId)

  function save(next: AutomationFlow) { storage.saveAutomationFlow({ ...next, updatedAt: new Date().toISOString() }) }
  function createFlow() { const next: AutomationFlow = { id: makeId("flow"), name: "Untitled automation", nodes: [], runs: [], updatedAt: new Date().toISOString() }; storage.saveAutomationFlow(next); setActiveId(next.id) }
  function addNode() { if (!flow) return; save({ ...flow, nodes: [...flow.nodes, { id: makeId("node"), type: nodeType, label: nodeType, config: "" }] }) }
  function runFlow() {
    if (!flow) return
    const startedAt = new Date().toISOString()
    const log = flow.nodes.length ? flow.nodes.map((node,index) => `${index + 1}. ${node.type}: ${node.label} — ${node.config || "default configuration"}`) : ["Flow has no nodes."]
    const status = flow.nodes.length ? "Complete" as const : "Failed" as const
    save({ ...flow, runs: [{ id: makeId("automation_run"), status, startedAt, log }, ...flow.runs].slice(0, 20) })
  }

  return <div className="applicationWorkspace">
    <div className="applicationHero"><div><div className="sectionEyebrow">AUTOMATION</div><h1>Build visual lab workflows and run them as repeatable pipelines</h1><p>The flow designer is functional for OpenLab workflow logic. Real instrument control requires a connector for each instrument/API; the UI does not pretend unsupported hardware is connected.</p></div><button className="primaryButton" onClick={createFlow}>+ New automation</button></div>
    <div className="applicationSplit compactListSplit"><aside className="applicationList"><div className="applicationListHead"><strong>Automation flows</strong><span>{state?.automationFlows.length || 0}</span></div>{state?.automationFlows.map(item => <button key={item.id} className={activeId === item.id ? "active" : ""} onClick={() => setActiveId(item.id)}><strong>{item.name}</strong><span>{item.nodes.length} nodes · {item.runs.length} runs</span></button>)}</aside><main className="applicationEditor">{flow ? <><div className="applicationEditorHead"><div><input className="applicationTitleInput" value={flow.name} onChange={event => save({ ...flow, name: event.target.value })}/><span>Visual orchestration flow</span></div><button className="primaryButton" onClick={runFlow}>Run flow</button></div><div className="automationToolRow"><select value={nodeType} onChange={event => setNodeType(event.target.value as AutomationNodeType)}>{nodeTypes.map(type => <option key={type}>{type}</option>)}</select><button className="ghostButton" onClick={addNode}>+ Add node</button></div><div className="automationCanvas">{flow.nodes.map((node,index) => <div className="automationNode" key={node.id}><div className="nodeNumber">{index + 1}</div><div><span>{node.type}</span><input value={node.label} onChange={event => save({ ...flow, nodes: flow.nodes.map(item => item.id === node.id ? { ...item, label: event.target.value } : item) })}/><textarea value={node.config} onChange={event => save({ ...flow, nodes: flow.nodes.map(item => item.id === node.id ? { ...item, config: event.target.value } : item) })} placeholder="Configuration / transformation rule…"/></div><div className="nodeActions"><button disabled={index === 0} onClick={() => { const nodes=[...flow.nodes]; [nodes[index-1],nodes[index]]=[nodes[index],nodes[index-1]]; save({ ...flow, nodes }) }}>↑</button><button disabled={index === flow.nodes.length-1} onClick={() => { const nodes=[...flow.nodes]; [nodes[index+1],nodes[index]]=[nodes[index],nodes[index+1]]; save({ ...flow, nodes }) }}>↓</button><button onClick={() => save({ ...flow, nodes: flow.nodes.filter(item => item.id !== node.id) })}>×</button></div>{index < flow.nodes.length - 1 && <div className="nodeConnector">↓</div>}</div>)}{!flow.nodes.length && <div className="automationEmpty">Add a node to start building the workflow.</div>}</div><section className="automationRuns"><div className="cardHeader"><div><div className="sectionEyebrow">RUN HISTORY</div><h2>Latest executions</h2></div></div>{flow.runs.map(run => <details key={run.id}><summary><strong>{run.status}</strong><span>{new Date(run.startedAt).toLocaleString()}</span></summary><pre>{run.log.join("\n")}</pre></details>)}{!flow.runs.length && <div className="analysisEmpty">Run the flow to generate an execution record.</div>}</section></> : <div className="emptyState"><strong>Create an automation flow</strong></div>}</main></div>
  </div>
}
