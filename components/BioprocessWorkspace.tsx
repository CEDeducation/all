"use client"

import { useEffect, useMemo, useState } from "react"
import { makeId } from "@/lib/id"
import { storage } from "@/lib/storage"
import type { BioprocessRecipe, BioprocessStudy, WorkspaceState } from "@/lib/types"

type Tab = "recipes" | "planning" | "execution" | "insights"

function newRecipe(): BioprocessRecipe {
  return { id: makeId("recipe"), name: "Untitled recipe", description: "", published: false, unitOperations: [], updatedAt: new Date().toISOString() }
}

export default function BioprocessWorkspace() {
  const [state, setState] = useState<WorkspaceState | null>(null)
  const [tab, setTab] = useState<Tab>("recipes")
  const [recipeId, setRecipeId] = useState("")
  const [studyId, setStudyId] = useState("")
  const [studyName, setStudyName] = useState("Process development study")
  const [conditionText, setConditionText] = useState("Control, High feed")
  const [replicates, setReplicates] = useState(2)

  const refresh = () => {
    const next = storage.getState(); setState(next)
    setRecipeId(current => current && next.bioprocessRecipes.some(item => item.id === current) ? current : (next.bioprocessRecipes[0]?.id || ""))
    setStudyId(current => current && next.bioprocessStudies.some(item => item.id === current) ? current : (next.bioprocessStudies[0]?.id || ""))
  }
  useEffect(() => { refresh(); window.addEventListener(storage.eventName, refresh); return () => window.removeEventListener(storage.eventName, refresh) }, [])

  const recipe = state?.bioprocessRecipes.find(item => item.id === recipeId)
  const study = state?.bioprocessStudies.find(item => item.id === studyId)
  const completeRuns = study?.runs.filter(run => run.status === "Complete") || []
  const meanYield = useMemo(() => {
    const values = completeRuns.map(run => run.yieldValue).filter((value): value is number => typeof value === "number")
    return values.length ? values.reduce((a,b) => a+b,0) / values.length : null
  }, [study])

  function saveRecipe(next: BioprocessRecipe) { storage.saveBioprocessRecipe({ ...next, updatedAt: new Date().toISOString() }) }
  function saveStudy(next: BioprocessStudy) { storage.saveBioprocessStudy({ ...next, updatedAt: new Date().toISOString() }) }

  function createRecipe() { const item = newRecipe(); storage.saveBioprocessRecipe(item); setRecipeId(item.id); setTab("recipes") }
  function addOperation() {
    if (!recipe) return
    saveRecipe({ ...recipe, unitOperations: [...recipe.unitOperations, { id: makeId("operation"), name: "Unit operation", equipment: "", parameters: [], steps: ["Record operator action"] }] })
  }
  function createStudy() {
    if (!recipe) return
    const conditions = conditionText.split(",").map(item => item.trim()).filter(Boolean)
    const runs = conditions.flatMap(condition => Array.from({ length: Math.max(1, replicates) }, (_, index) => ({ id: makeId("run"), label: `${condition} · R${index + 1}`, condition, replicate: index + 1, status: "Planned" as const, currentOperation: 0, observations: "" })))
    const next: BioprocessStudy = { id: makeId("study"), name: studyName, recipeId: recipe.id, conditions, replicates: Math.max(1, replicates), runs, updatedAt: new Date().toISOString() }
    storage.saveBioprocessStudy(next); setStudyId(next.id); setTab("execution")
  }

  return <div className="applicationWorkspace">
    <div className="applicationHero"><div><div className="sectionEyebrow">BIOPROCESS</div><h1>Recipe design → experiment planning → batch execution → insights</h1><p>A structured process-development workspace based on real process-development concepts: recipes, unit operations, conditions, replicates and guided runs.</p></div><button className="primaryButton" onClick={createRecipe}>+ New recipe</button></div>
    <div className="applicationTabs"><button className={tab === "recipes" ? "active" : ""} onClick={() => setTab("recipes")}>Process design</button><button className={tab === "planning" ? "active" : ""} onClick={() => setTab("planning")}>Experiment planning</button><button className={tab === "execution" ? "active" : ""} onClick={() => setTab("execution")}>Batch execution</button><button className={tab === "insights" ? "active" : ""} onClick={() => setTab("insights")}>Process insights</button></div>

    {tab === "recipes" && <div className="applicationSplit compactListSplit"><aside className="applicationList"><div className="applicationListHead"><strong>Recipes</strong><span>{state?.bioprocessRecipes.length || 0}</span></div>{state?.bioprocessRecipes.map(item => <button key={item.id} className={item.id === recipeId ? "active" : ""} onClick={() => setRecipeId(item.id)}><strong>{item.name}</strong><span>{item.unitOperations.length} unit operations</span></button>)}</aside><main className="applicationEditor">{recipe ? <><div className="applicationEditorHead"><div><input className="applicationTitleInput" value={recipe.name} onChange={event => saveRecipe({ ...recipe, name: event.target.value })}/><span>{recipe.published ? "Published / locked intent" : "Draft recipe"}</span></div><label className="publishSwitch"><input type="checkbox" checked={recipe.published} onChange={event => saveRecipe({ ...recipe, published: event.target.checked })}/> Published</label></div><textarea className="wideTextarea" value={recipe.description} onChange={event => saveRecipe({ ...recipe, description: event.target.value })} placeholder="Describe process intent and design space…"/><div className="recipeFlow">{recipe.unitOperations.map((op, index) => <div className="recipeOperation" key={op.id}><div className="recipeIndex">{index + 1}</div><input value={op.name} onChange={event => saveRecipe({ ...recipe, unitOperations: recipe.unitOperations.map(item => item.id === op.id ? { ...item, name: event.target.value } : item) })}/><input placeholder="Equipment" value={op.equipment} onChange={event => saveRecipe({ ...recipe, unitOperations: recipe.unitOperations.map(item => item.id === op.id ? { ...item, equipment: event.target.value } : item) })}/><button onClick={() => saveRecipe({ ...recipe, unitOperations: recipe.unitOperations.filter(item => item.id !== op.id) })}>×</button></div>)}<button className="addFlowNode" onClick={addOperation}>+ Add unit operation</button></div></> : <div className="emptyState"><strong>Create a recipe</strong></div>}</main></div>}

    {tab === "planning" && <section className="surfaceCard applicationFormCard"><h2>Plan a study from a recipe</h2><div className="formGrid twoCol"><label><span>Recipe</span><select value={recipeId} onChange={event => setRecipeId(event.target.value)}>{state?.bioprocessRecipes.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label><span>Study name</span><input value={studyName} onChange={event => setStudyName(event.target.value)}/></label><label><span>Conditions (comma-separated)</span><input value={conditionText} onChange={event => setConditionText(event.target.value)}/></label><label><span>Replicates per condition</span><input type="number" min="1" max="12" value={replicates} onChange={event => setReplicates(Number(event.target.value))}/></label></div><button className="primaryButton" disabled={!recipe} onClick={createStudy}>Generate study runs</button></section>}

    {tab === "execution" && <section className="surfaceCard executionCard"><div className="cardHeader"><div><div className="sectionEyebrow">GUIDED EXECUTION</div><h2>{study?.name || "No study selected"}</h2></div><select value={studyId} onChange={event => setStudyId(event.target.value)}><option value="">Select study</option>{state?.bioprocessStudies.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>{study ? <div className="runGrid">{study.runs.map(run => <article className="runCard" key={run.id}><div><span>{run.condition}</span><strong>{run.label}</strong></div><select value={run.status} onChange={event => saveStudy({ ...study, runs: study.runs.map(item => item.id === run.id ? { ...item, status: event.target.value as typeof run.status } : item) })}><option>Planned</option><option>Running</option><option>Complete</option></select><label><span>Current unit operation</span><select value={run.currentOperation} onChange={event => saveStudy({ ...study, runs: study.runs.map(item => item.id === run.id ? { ...item, currentOperation: Number(event.target.value) } : item) })}>{(recipe?.unitOperations || []).map((op,index) => <option key={op.id} value={index}>{index + 1}. {op.name}</option>)}</select></label><label><span>Yield / response</span><input type="number" value={run.yieldValue ?? ""} onChange={event => saveStudy({ ...study, runs: study.runs.map(item => item.id === run.id ? { ...item, yieldValue: event.target.value === "" ? undefined : Number(event.target.value) } : item) })}/></label><textarea value={run.observations} onChange={event => saveStudy({ ...study, runs: study.runs.map(item => item.id === run.id ? { ...item, observations: event.target.value } : item) })} placeholder="Operator observations…"/></article>)}</div> : <div className="analysisEmpty">Create a study in Experiment planning first.</div>}</section>}

    {tab === "insights" && <section className="surfaceCard insightsCard"><div className="cardHeader"><div><div className="sectionEyebrow">PROCESS INSIGHTS</div><h2>Study summary</h2></div></div><div className="insightMetrics"><div><span>Total runs</span><strong>{study?.runs.length || 0}</strong></div><div><span>Completed</span><strong>{completeRuns.length}</strong></div><div><span>Mean yield / response</span><strong>{meanYield === null ? "—" : meanYield.toFixed(2)}</strong></div></div><div className="simpleBarList">{study?.runs.filter(run => typeof run.yieldValue === "number").map(run => <div key={run.id}><span>{run.label}</span><div><i style={{ width: `${Math.min(100, Math.max(2, Number(run.yieldValue)))}%` }}/></div><b>{run.yieldValue}</b></div>)}</div></section>}
  </div>
}
