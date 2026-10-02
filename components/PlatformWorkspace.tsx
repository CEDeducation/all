import Link from "next/link"
import { DnaIcon, WorkflowIcon, SparkIcon, FlaskIcon } from "./Icons"

const modules = [
  { href: "/bioresearch", eyebrow: "BIORESEARCH", title: "Bioresearch", body: "Structured assay capture connected to notebook, molecular design, registry and evidence.", icon: DnaIcon },
  { href: "/bioprocess", eyebrow: "BIOPROCESS", title: "Bioprocess", body: "Recipe design, experiment planning, guided batch execution and process insights.", icon: WorkflowIcon },
  { href: "/automation", eyebrow: "AUTOMATION", title: "Automation", body: "Visual workflow designer, configurable processing nodes and execution history.", icon: SparkIcon },
  { href: "/invivo", eyebrow: "IN VIVO", title: "In Vivo", body: "Study design, groups, planned animals and guided action capture for dosing, samples and observations.", icon: FlaskIcon },
]

export default function PlatformWorkspace(){
  return <div className="pageBody stackPage"><div className="pageHeading"><div><div className="sectionEyebrow">OPENLAB APPLICATIONS</div><h1>Four working scientific applications</h1><p>These are separate OpenLab workflows with persistent data, not renamed shortcuts to older pages.</p></div></div><section className="surfaceCard platformOverviewCard"><div className="platformCardGrid">{modules.map(module=>{const Icon=module.icon;return <Link href={module.href} className="platformCard platformCardLarge" key={module.href}><div className="platformCardIcon"><Icon size={22}/></div><span>{module.eyebrow}</span><strong>{module.title}</strong><p>{module.body}</p><b>Open application →</b></Link>})}</div></section></div>
}
