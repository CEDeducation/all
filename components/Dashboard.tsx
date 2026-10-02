"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getActiveLabSession, labSessionEvent } from "@/lib/lab-session"
import { storage } from "@/lib/storage"
import type { WorkspaceState } from "@/lib/types"
import { BookIcon, DnaIcon, FlaskIcon, SparkIcon, WorkflowIcon } from "./Icons"

const applications = [
  { href: "/bioresearch", label: "Bioresearch", detail: "Assays and experimental data", icon: DnaIcon },
  { href: "/bioprocess", label: "Bioprocess", detail: "Recipes, runs and process insights", icon: WorkflowIcon },
  { href: "/automation", label: "Automation", detail: "Visual lab workflows", icon: SparkIcon },
  { href: "/invivo", label: "In Vivo", detail: "Studies, cohorts and observations", icon: FlaskIcon },
]

type RecentItem = { id: string; title: string; detail: string; href: string; kind: "Experiment" | "Sequence" }

export default function Dashboard() {
  const [state, setState] = useState<WorkspaceState | null>(null)
  const [profileName, setProfileName] = useState("Researcher")
  const [workspaceName, setWorkspaceName] = useState("OpenLab")

  useEffect(() => {
    const refresh = () => {
      setState(storage.getState())
      const session = getActiveLabSession()
      if (session) {
        setProfileName(session.profile.displayName)
        setWorkspaceName(session.workspaceName)
      }
    }
    refresh()
    window.addEventListener(storage.eventName, refresh)
    window.addEventListener(labSessionEvent, refresh)
    return () => {
      window.removeEventListener(storage.eventName, refresh)
      window.removeEventListener(labSessionEvent, refresh)
    }
  }, [])

  const recent = useMemo<RecentItem[]>(() => {
    if (!state) return []
    const experiments = state.notebook.map(item => ({
      id: `experiment-${item.id}`,
      title: item.title,
      detail: `${item.status} · updated ${new Date(item.updatedAt).toLocaleDateString()}`,
      href: "/notebook",
      kind: "Experiment" as const,
      updatedAt: item.updatedAt,
    }))
    const sequences = state.sequences.map(item => ({
      id: `sequence-${item.id}`,
      title: item.name,
      detail: `${item.sequence.length.toLocaleString()} bp · ${item.topology}`,
      href: "/plasmids",
      kind: "Sequence" as const,
      updatedAt: item.updatedAt,
    }))
    return [...experiments, ...sequences]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4)
      .map(({ updatedAt: _updatedAt, ...item }) => item)
  }, [state])

  return (
    <div className="dashboardPage minimalDashboard">
      <section className="minimalHero">
        <div>
          <span className="sectionEyebrow">{workspaceName.toUpperCase()}</span>
          <h1>Welcome back, {profileName}.</h1>
          <p>Pick up where you left off or start a new experiment.</p>
        </div>
        <div className="minimalHeroActions">
          <Link href="/notebook" className="primaryButton linkButton">+ New experiment</Link>
          <Link href="/plasmids" className="ghostButton linkButton">Molecular biology</Link>
        </div>
      </section>

      <div className="minimalHomeGrid">
        <section className="surfaceCard minimalPanel">
          <div className="minimalPanelHead">
            <div><span className="sectionEyebrow">CONTINUE</span><h2>Recent work</h2></div>
          </div>
          <div className="minimalRecentList">
            {recent.length ? recent.map(item => (
              <Link href={item.href} className="minimalRecentRow" key={item.id}>
                <span className="minimalRecentIcon">{item.kind === "Experiment" ? <BookIcon size={18}/> : <DnaIcon size={18}/>}</span>
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
                <b>→</b>
              </Link>
            )) : (
              <div className="quietEmpty minimalEmpty">No research yet. Create your first experiment or import a sequence.</div>
            )}
          </div>
        </section>

        <section className="surfaceCard minimalPanel">
          <div className="minimalPanelHead">
            <div><span className="sectionEyebrow">APPLICATIONS</span><h2>Open a workspace</h2></div>
          </div>
          <div className="minimalAppList">
            {applications.map(({ href, label, detail, icon: Icon }) => (
              <Link href={href} className="minimalAppRow" key={href}>
                <span className="minimalAppIcon"><Icon size={18}/></span>
                <div><strong>{label}</strong><small>{detail}</small></div>
                <b>→</b>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
