"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { BookIcon, ChemistryIcon, CloudIcon, DatabaseIcon, DnaIcon, FlaskIcon, FolderIcon, HelpIcon, RegistryIcon, SearchIcon, SettingsIcon, SparkIcon, UploadIcon, WorkflowIcon } from "./Icons"

type HelpSection = {
  id: string
  category: string
  title: string
  summary: string
  href?: string
  action?: string
  steps: string[]
  tips?: string[]
  icon: (props: { size?: number }) => JSX.Element
}

const sections: HelpSection[] = [
  {
    id: "account",
    category: "Getting started",
    title: "Create your lab account and researcher profile",
    summary: "OpenLab uses one main lab login and up to four protected researcher profiles inside that lab workspace.",
    steps: [
      "On the OpenLab sign-in screen, choose Create a new lab account.",
      "Enter the lab email and a password of at least 8 characters.",
      "After the main account is created, name the shared lab workspace.",
      "Create the first researcher profile. The first profile is automatically the Lab owner / PI.",
      "Choose a 4–8 digit PIN for that profile. Additional profiles can be Owner, Researcher, Student, or Viewer.",
      "When you return later, sign in with the main lab email/password, choose your profile, and enter that profile PIN.",
    ],
    tips: [
      "The main password and profile PIN are different credentials.",
      "A lab can have a maximum of four active profiles in the current profile model.",
      "Use the profile button at the top-right of OpenLab to switch researcher profiles without leaving the lab workspace.",
    ],
    icon: HelpIcon,
  },
  {
    id: "password",
    category: "Getting started",
    title: "Reset a forgotten password",
    summary: "Use the Supabase-backed recovery flow if the main lab password is forgotten.",
    steps: [
      "On the login screen, click Forgot password?.",
      "Enter the main OpenLab account email and choose Send reset email.",
      "Open the recovery email and follow its link back to OpenLab.",
      "Enter a new password of at least 8 characters twice.",
      "Choose Update password. The previous password will no longer work after the reset succeeds.",
    ],
    tips: [
      "Password recovery works only when OpenLab is connected to Supabase cloud mode.",
      "If the recovery link does not return to OpenLab, check the allowed redirect URL in Supabase Authentication → URL Configuration.",
    ],
    icon: CloudIcon,
  },
  {
    id: "navigation",
    category: "Getting started",
    title: "Understand the OpenLab layout",
    summary: "The left sidebar contains applications, core research workspaces, and system tools. The top bar provides global search, sync status, and profile switching.",
    steps: [
      "Use Applications for Bioresearch, Bioprocess, Automation, and In Vivo work.",
      "Use Core for Projects, Notebook, Protocols, Registry, Molecular biology, and Workflows.",
      "Use System for Evidence, Activity, Help, and Settings & sync.",
      "Use the global search box in the top bar to search projects, experiments, protocols, registry entities, sequences, tasks, and evidence.",
      "Press Ctrl+K on Windows/Linux or Command+K on macOS to jump directly into global search.",
      "Watch the cloud badge in the top-right: Saving… means changes are syncing, Saved means the last cloud write completed, and Sync issue means the connection needs attention.",
    ],
    icon: SearchIcon,
  },
  {
    id: "home",
    category: "Core workflow",
    title: "Use Home as a launch point, not a control room",
    summary: "The Home page is intentionally minimal. It should help you resume work quickly instead of showing every feature at once.",
    href: "/",
    action: "Open Home",
    steps: [
      "Choose New experiment when you want to begin a notebook entry.",
      "Choose Molecular biology when you want to import or inspect DNA/RNA records.",
      "Use Recent work to reopen the records you were working on most recently.",
      "Use the compact application shortcuts for Bioresearch, Bioprocess, Automation, and In Vivo.",
      "For everything else, use the persistent left sidebar rather than searching the Home page.",
    ],
    icon: HelpIcon,
  },
  {
    id: "projects",
    category: "Core workflow",
    title: "Organize research with Projects",
    summary: "Projects provide a shared context for experiments, assay runs, tasks, and other research objects.",
    href: "/projects",
    action: "Open Projects",
    steps: [
      "Open Projects and create a new project.",
      "Give the project a clear name and set its status.",
      "Use the project in Notebook entries, Bioresearch assay runs, and Workflow tasks so related work stays connected.",
      "Open an existing project from the list to update its details instead of creating duplicate projects.",
    ],
    tips: ["Use one project for one coherent research objective or study rather than creating a project for every individual experiment."],
    icon: FolderIcon,
  },
  {
    id: "notebook",
    category: "Core workflow",
    title: "Record an experiment in Notebook",
    summary: "Notebook is the central electronic experiment record for procedures, observations, results, files, tags, projects, and linked biological entities.",
    href: "/notebook",
    action: "Open Notebook",
    steps: [
      "Choose Create entry to make a new experiment record.",
      "Replace the default title with a descriptive experiment name.",
      "Set the experiment status to Draft, Running, or Complete.",
      "Link the experiment to a Project when applicable.",
      "Add tags so the experiment is easier to find later.",
      "Link relevant Registry entities such as plasmids, proteins, compounds, samples, or cell lines.",
      "Write the protocol/procedure, observations, and results in the large notebook sections.",
      "Use Add files to attach supporting material such as images, PDFs, tables, or result files.",
      "Open an attachment from the attachment list when you need to retrieve it later.",
    ],
    tips: [
      "Notebook changes are local-first and autosaved as you work.",
      "When cloud sync is configured, the workspace snapshot is also synchronized to Supabase.",
    ],
    icon: BookIcon,
  },
  {
    id: "protocols",
    category: "Core workflow",
    title: "Build reusable Protocols",
    summary: "Protocols let the lab store repeatable wet-lab, dry-lab, or general procedures as ordered steps.",
    href: "/protocols",
    action: "Open Protocols",
    steps: [
      "Choose New protocol.",
      "Set the protocol name, category, version, tags, and description.",
      "Choose Add step for each procedure step.",
      "Write the action for the step and, when appropriate, record its expected duration in minutes.",
      "Use the up/down controls to reorder procedure steps.",
      "Increment the version number when you intentionally publish a revised method.",
    ],
    tips: ["Keep steps operational and specific enough that a different lab member can reproduce the procedure."],
    icon: FlaskIcon,
  },
  {
    id: "registry",
    category: "Core workflow",
    title: "Track biological entities in Registry",
    summary: "Registry stores the identity and relationships of DNA, RNA, proteins, cell lines, compounds, samples, organisms, and reagents.",
    href: "/registry",
    action: "Open Registry",
    steps: [
      "Choose New entity.",
      "Set the entity type and, if useful, a schema such as Plasmid or Cell line.",
      "Give the entity a unique, descriptive name and optional aliases.",
      "Use Parent / lineage to show that one entity was derived from another.",
      "Add a description and structured metadata fields for lab-specific properties.",
      "If the entity has a DNA sequence, link it to a Molecular biology sequence record.",
      "Use the type filter on the left to narrow the registry when it grows.",
    ],
    icon: RegistryIcon,
  },
  {
    id: "molecular-import",
    category: "Molecular biology",
    title: "Import FASTA, GenBank, CSV, TSV, JSON, or raw DNA",
    summary: "The molecular workbench accepts common sequence formats and converts them into editable OpenLab sequence records.",
    href: "/plasmids",
    action: "Open Molecular biology",
    steps: [
      "Open Molecular biology and choose Import sequences.",
      "Upload a .fasta/.fa/.fna file for sequence-only records, or .gb/.gbk/.genbank when you want annotated GenBank features and topology.",
      "CSV, TSV, and JSON imports can be used when the file contains recognizable sequence fields.",
      "You can also paste raw DNA or FASTA text directly into the import dialog.",
      "Review the parsed record, then import it into the workspace.",
      "The imported record appears in the DNA & RNA library on the left.",
    ],
    tips: [
      "FASTA itself does not encode circular/linear topology, so FASTA records should be reviewed after import.",
      "GenBank records can preserve supported feature annotations and circular topology information.",
    ],
    icon: DnaIcon,
  },
  {
    id: "plasmid-map",
    category: "Molecular biology",
    title: "Use the circular plasmid map",
    summary: "The PLASMID view is an interactive circular map with annotations, primers, restriction marks, coordinates, rotation, and zoom.",
    href: "/plasmids",
    action: "Open Molecular biology",
    steps: [
      "Select a circular sequence from the DNA & RNA list.",
      "Choose PLASMID in the map panel.",
      "Move the pointer over the map to start the gentle auto-rotation preview.",
      "Drag directly on the disc to rotate it manually.",
      "Use the mouse wheel to rotate in small steps.",
      "Hold Ctrl or Command while using the mouse wheel to zoom the map.",
      "Hover an annotation to emphasize that region and open the feature spotlight card.",
      "Click an annotation or its label to select it and load its details into the annotation editor.",
      "Use LINEAR MAP when a coordinate-oriented view is clearer, or METADATA for record statistics and annotation summary.",
    ],
    tips: ["The map is a visualization of the loaded sequence record; editing an annotation changes the record, not just the drawing."],
    icon: DnaIcon,
  },
  {
    id: "annotations",
    category: "Molecular biology",
    title: "Create and edit sequence annotations",
    summary: "Annotations mark functional or descriptive regions such as CDS, promoters, resistance genes, origins, or miscellaneous features.",
    href: "/plasmids",
    action: "Open Molecular biology",
    steps: [
      "Choose the + button beside Annotations to create a new feature.",
      "Set its name and feature type.",
      "Enter start and end coordinates.",
      "Set the strand direction to Forward (+) or Reverse (−).",
      "Choose a feature color and add notes if needed.",
      "For CDS features, OpenLab shows a translation preview from the annotated region.",
      "Use the delete button in the feature editor if the annotation is no longer needed.",
    ],
    icon: DnaIcon,
  },
  {
    id: "sequence-edit",
    category: "Molecular biology",
    title: "Edit the raw DNA sequence and search motifs",
    summary: "OpenLab can display and edit the underlying DNA rather than treating the plasmid map as a static picture.",
    href: "/plasmids",
    action: "Open Molecular biology",
    steps: [
      "Use the Find field in the molecular toolbar to search for a DNA motif in the active record.",
      "The Sequence pane displays bases with coordinates and highlights matching sequence text.",
      "Choose Edit raw sequence when you need to replace or change the underlying DNA string.",
      "Paste or type the edited sequence and review the parsed length before applying it.",
      "After editing, inspect annotations and primers because sequence-length changes can affect their coordinates.",
    ],
    icon: SearchIcon,
  },
  {
    id: "primer",
    category: "Molecular biology",
    title: "Design primers and check PCR",
    summary: "The Primer design & PCR panel creates primer candidates from the active DNA record and maps saved primers back onto the sequence.",
    href: "/plasmids",
    action: "Open Molecular biology",
    steps: [
      "Open the Primer design & PCR tab below the sequence editor.",
      "Choose the target region and design settings exposed by the panel.",
      "Generate primer candidates from the actual sequence.",
      "Review forward/reverse primer sequence, length, GC%, estimated melting temperature, and amplicon size.",
      "Review any warnings before using a candidate experimentally.",
      "Add the chosen pair to the sequence so the primers appear on the map and in the primer list.",
      "Use the PCR check to confirm exact sequence matching and the predicted product in the current record.",
    ],
    tips: [
      "OpenLab's browser primer calculations are screening calculations, not a substitute for experimental validation.",
      "For publication-grade primer design, validate candidates with an established tool such as Primer3/Primer-BLAST and appropriate wet-lab controls.",
    ],
    icon: DnaIcon,
  },
  {
    id: "restriction-orf-export",
    category: "Molecular biology",
    title: "Run restriction analysis, ORF finding, and export",
    summary: "The molecular workbench also includes restriction-site analysis, virtual digestion, ORF discovery, translation, and sequence export.",
    href: "/plasmids",
    action: "Open Molecular biology",
    steps: [
      "Open Restriction digest to inspect supported enzyme cut sites and predicted fragments.",
      "Enable Restriction marks in the toolbar if you want cut-site indicators shown on the map.",
      "Open ORF finder to inspect candidate open reading frames on the DNA record.",
      "Use Export in the molecular header to download the current record as FASTA or GenBank.",
      "Use Link to registry if the sequence should become a tracked biological entity in the Registry.",
    ],
    icon: DnaIcon,
  },
  {
    id: "bioresearch",
    category: "Applications",
    title: "Use Bioresearch for structured assay results",
    summary: "Bioresearch stores assay runs with project links, status, samples, metrics, numerical values, and units.",
    href: "/bioresearch",
    action: "Open Bioresearch",
    steps: [
      "Choose + New assay run.",
      "Rename the assay and set its status to Draft, Running, or Complete.",
      "Set the assay type and optionally link it to a Project.",
      "Choose + Add row to create a structured result row.",
      "Enter the sample name, metric, numeric value, and unit.",
      "Add additional rows for replicates or additional samples.",
      "The application shows the number of rows and a simple mean across entered numerical values.",
    ],
    tips: ["Use the quick links at the top of Bioresearch to jump to Notebook, Molecular biology, Registry, or Evidence without losing the broader research context."],
    icon: DnaIcon,
  },
  {
    id: "bioprocess",
    category: "Applications",
    title: "Use Bioprocess from recipe design to process insights",
    summary: "Bioprocess is organized as Process design → Experiment planning → Batch execution → Process insights.",
    href: "/bioprocess",
    action: "Open Bioprocess",
    steps: [
      "In Process design, choose + New recipe and name the process recipe.",
      "Use + Add unit operation to define each ordered operation and the associated equipment.",
      "Mark a recipe Published when you want to indicate that it is the intended process definition.",
      "Open Experiment planning, choose the recipe, enter a study name, enter comma-separated conditions, and set replicates per condition.",
      "Choose Generate study runs. OpenLab creates a run for every condition × replicate combination.",
      "Open Batch execution, choose the study, and move each run through Planned, Running, and Complete.",
      "Record the current unit operation, observations, and yield/response values as runs progress.",
      "Open Process insights to see total runs, completed runs, mean yield/response, and individual run values.",
    ],
    icon: WorkflowIcon,
  },
  {
    id: "automation",
    category: "Applications",
    title: "Build and run Automation flows",
    summary: "Automation lets you create a visual sequence of repeatable nodes and keep execution history for the flow.",
    href: "/automation",
    action: "Open Automation",
    steps: [
      "Choose + New automation.",
      "Rename the automation flow.",
      "Choose a node type and then + Add node.",
      "Typical nodes include Instrument input, Transform, Analysis, Decision, and Notebook output.",
      "Rename each node so its purpose is obvious to other lab members.",
      "Use the up/down controls to change execution order and × to remove a node.",
      "Choose Run flow to create an execution record.",
      "Review Run history to see when the flow ran, its status, and the generated execution log.",
    ],
    tips: ["The current application models and executes OpenLab workflow logic. Physical instrument control still requires a real vendor/instrument connector."],
    icon: SparkIcon,
  },
  {
    id: "invivo",
    category: "Applications",
    title: "Plan and document In Vivo studies",
    summary: "In Vivo supports study design, groups/cohorts, planned animals, and traceable Dose, Measurement, Sample, and Observation events.",
    href: "/invivo",
    action: "Open In Vivo",
    steps: [
      "Choose + New study and enter the study name.",
      "In Study design, set species and study status.",
      "Create study groups and enter the treatment/condition for each group.",
      "Open Animals & groups and choose + Add animal for every planned animal.",
      "Assign an animal ID, group, sex, weight, and status.",
      "Open Guided workflow when the study is running.",
      "Choose an animal, select Dose, Measurement, Sample, or Observation, enter the value/unit, and choose Record.",
      "Review the chronological event list as the study progresses.",
    ],
    tips: ["OpenLab records study operations; institutional animal-care approvals, protocol compliance, and ethical review remain the responsibility of the research institution."],
    icon: FlaskIcon,
  },
  {
    id: "workflows",
    category: "Core workflow",
    title: "Track research tasks in Workflows",
    summary: "Workflows is a Kanban-style task board for research work that is planned, ready, in progress, blocked, or complete.",
    href: "/workflows",
    action: "Open Workflows",
    steps: [
      "Choose the + button in the appropriate status column to create a task there.",
      "Open the task card to edit its title, status, due date, and assignee.",
      "Link the task to a Project when it belongs to a defined study.",
      "Link Registry entities when the task concerns specific biological materials or constructs.",
      "Change the status as the task moves through the workflow.",
      "Delete obsolete tasks from the task drawer rather than leaving stale work in the board.",
    ],
    icon: WorkflowIcon,
  },
  {
    id: "evidence",
    category: "Evidence & Copilot",
    title: "Search the Scientific Sandbox",
    summary: "Evidence searches approved scientific sources instead of general-web results and lets you save relevant records into the lab Evidence library.",
    href: "/sources",
    action: "Open Evidence",
    steps: [
      "Enter a specific research query such as a gene symbol, compound, DOI, accession, or paper title.",
      "Choose All science, Papers, Genetics, Chemistry, or Structures to narrow the search mode.",
      "Choose Search and review the records returned from the approved scientific providers.",
      "Choose Open source when you want to inspect the record at its original provider.",
      "Choose Save record to add a useful result to the private OpenLab Evidence library.",
      "When an eligible open-access full text is available, choose Import OA full text to save additional source text.",
      "You can also add private lab evidence manually with a title, optional URL, and source text, or import a text/Markdown/CSV/JSON file.",
    ],
    tips: ["Saving evidence makes it available to source-bounded research assistance without relying on arbitrary general-web pages."],
    icon: DatabaseIcon,
  },
  {
    id: "copilot",
    category: "Evidence & Copilot",
    title: "Use the source-bounded Copilot responsibly",
    summary: "The Scientific Copilot is intended to synthesize retrieved evidence, not to invent unsupported scientific conclusions.",
    href: "/sources",
    action: "Open Evidence & Copilot",
    steps: [
      "Search for relevant scientific evidence first.",
      "Save the most relevant records when you want them retained in the workspace Evidence library.",
      "Ask a focused scientific question rather than a vague topic request.",
      "If you want private lab Evidence included in the response, explicitly enable the lab-evidence option.",
      "Read the cited source cards alongside the answer instead of treating the generated summary as primary evidence.",
      "Open the original source when a claim will affect an experiment, publication, clinical decision, or other high-stakes work.",
    ],
    tips: ["If no AI API is configured, the scientific search/evidence system can still be used without generated synthesis."],
    icon: SparkIcon,
  },
  {
    id: "activity",
    category: "System",
    title: "Review Activity history",
    summary: "Activity shows recent record creation, edits, and deletions captured by OpenLab's workspace event log.",
    href: "/activity",
    action: "Open Activity",
    steps: [
      "Open Activity from the System section of the sidebar.",
      "Review what changed, the record involved, and the timestamp.",
      "Use Activity when you need to understand how the current workspace state was reached.",
    ],
    icon: HelpIcon,
  },
  {
    id: "sync",
    category: "System",
    title: "Configure cloud persistence and autosave",
    summary: "OpenLab works local-first. Supabase adds authenticated cloud persistence, shared workspace storage, and cross-device restoration.",
    href: "/settings",
    action: "Open Settings & sync",
    steps: [
      "Deploy OpenLab with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY configured in the hosting environment.",
      "Run the supplied Supabase migrations once in the OpenLab Supabase project.",
      "Sign in to the main OpenLab account.",
      "Choose or create the cloud workspace used by the lab.",
      "Use Upload local → cloud when you intentionally want to push the current local workspace into the selected cloud workspace.",
      "Use Download cloud → local when you intentionally want to replace the local working copy with the selected cloud copy.",
      "During normal work, watch the top-right cloud badge for automatic save state.",
    ],
    tips: [
      "Do not put a Supabase service-role/secret key in a browser-exposed NEXT_PUBLIC variable.",
      "The publishable/anon key is intended for the client; Row Level Security is responsible for data access control.",
    ],
    icon: CloudIcon,
  },
  {
    id: "backup",
    category: "System",
    title: "Export, import, and recover workspace data",
    summary: "Settings includes portable local backups in addition to cloud persistence.",
    href: "/settings",
    action: "Open Settings & sync",
    steps: [
      "Choose Export workspace to download a portable JSON backup of the current workspace data.",
      "Store important backups somewhere separate from the browser/device.",
      "Use Import backup when you intentionally want to restore a previously exported OpenLab workspace file.",
      "Use Reset local data only when you are certain the local workspace can be discarded or recovered elsewhere.",
    ],
    tips: ["Treat Reset local data as destructive. Export or confirm the cloud copy before resetting."],
    icon: SettingsIcon,
  },
  {
    id: "data",
    category: "System",
    title: "Know where OpenLab stores your work",
    summary: "OpenLab uses a local working copy for responsiveness and optional Supabase cloud persistence for durable shared storage.",
    steps: [
      "Structured workspace state is maintained locally in the browser so OpenLab responds immediately while you work.",
      "Notebook attachments use browser-side file storage locally and can be synchronized to the private OpenLab storage bucket when cloud mode is configured.",
      "Cloud workspace state is stored in the OpenLab Supabase project, not in the PocketNT Supabase project.",
      "Authentication accounts are managed by Supabase Auth when cloud mode is enabled.",
      "The main account password is handled by Supabase Auth and is not displayed back to the OpenLab administrator.",
      "Researcher profile PINs are verified through the profile system and should be stored only as hashes rather than readable PIN text.",
    ],
    icon: DatabaseIcon,
  },
  {
    id: "chemistry-start",
    category: "Chemistry & cheminformatics",
    title: "Start a chemistry project in 10 minutes",
    summary: "Use Chemistry when your research centers on small molecules, compound series, measured activity, chemical reactions, or structure-aware analysis.",
    href: "/chemistry",
    action: "Open Chemistry",
    steps: [
      "Open Chemistry from the Core section of the left sidebar. The Home page stays intentionally minimal, so the full chemistry suite lives in its own workspace.",
      "Choose Structure Lab and paste a SMILES string, MOL block, or one SDF record. You can also load one of the small reference structures to test the workflow.",
      "Choose Analyze structure. OpenLab loads RDKit.js in the browser, validates the chemical graph, creates a 2D depiction, canonical SMILES, InChI/InChIKey when available, a MOL block, a Morgan fingerprint, and molecular descriptors.",
      "Review the calculated structure and descriptors. If the structure is valid, choose Save to compound library.",
      "Open Compound library to add a project, series, tags, notes, PubChem/ChEMBL IDs, and optionally register the compound as an OpenLab Registry entity.",
      "Use Structure search for similarity or SMARTS substructure searching, SAR for experimental activity data, Screening for property filters, Reactions for synthesis records, and 3D & poses for coordinate files.",
      "Use Data tools to bulk-import a compound file or export the chemistry library as CSV/SDF.",
    ],
    tips: [
      "Calculated RDKit descriptors are not experimental measurements.",
      "OpenLab deliberately separates experimentally measured values, model predictions, and heuristic rules.",
      "The chemistry records are stored in the same OpenLab workspace state and therefore participate in the normal local autosave and cloud snapshot flow.",
    ],
    icon: ChemistryIcon,
  },
  {
    id: "chemistry-rdkit",
    category: "Chemistry & cheminformatics",
    title: "Understand the RDKit engine and structure normalization",
    summary: "OpenLab uses the official RDKit JavaScript/WebAssembly distribution for browser-side cheminformatics instead of hard-coded molecular values.",
    href: "/chemistry",
    action: "Open Structure Lab",
    steps: [
      "Open Chemistry → Structure Lab.",
      "Enter a valid SMILES, MOL block, or SDF structure and choose Analyze structure.",
      "RDKit parses the molecular graph. Invalid valence, malformed syntax, or an unsupported structure produces an error instead of silently creating a record.",
      "For a valid molecule, OpenLab stores the canonical SMILES returned by RDKit so later comparisons use a normalized representation.",
      "OpenLab also requests InChI and InChIKey when that functionality is present in the loaded RDKit MinimalLib build. The formula display is derived from the InChI formula layer when available.",
      "The MOL block returned by RDKit is saved for SDF export and for handoff to other chemistry tools.",
      "The descriptor panel shows RDKit-calculated values such as molecular weight, exact mass, Crippen cLogP, TPSA, H-bond donors/acceptors, rotatable bonds, ring counts, and fraction Csp3 when available.",
      "Use Re-analyze with RDKit on an existing compound after changing its structure so cached identifiers/descriptors are refreshed.",
    ],
    tips: [
      "RDKit runs locally in the browser through WebAssembly; the chemistry calculation itself does not require sending the structure to a third-party chemistry API.",
      "If the RDKit runtime fails to load after deployment, confirm that npm dependencies installed successfully and that /public/rdkit contains RDKit_minimal.js and RDKit_minimal.wasm after the postinstall step.",
    ],
    icon: ChemistryIcon,
  },
  {
    id: "chemistry-import",
    category: "Chemistry & cheminformatics",
    title: "Import SMILES, CSV, MOL, and SDF compound files",
    summary: "Use Structure Lab for a single molecule and Data tools for a compound library or multi-record SDF.",
    href: "/chemistry",
    action: "Open Chemistry",
    steps: [
      "For one structure, open Structure Lab and choose Import file. Supported single-record inputs include .smi/.smiles/.txt/.csv/.mol/.sdf.",
      "For many compounds, open Data tools and choose Choose structure file.",
      "For SMILES text, use one structure per line. A second tab- or whitespace-separated field is treated as the compound name when present.",
      "For CSV, include a header named smiles, canonical_smiles, canonical smiles, or structure. A name/compound/title/id column is used as the display name when present.",
      "For SDF, OpenLab separates records at $$$$ and sends each MOL block to RDKit for validation and normalization.",
      "Each valid structure receives normalized identifiers/descriptors before it is added to the chemistry library.",
      "Exact duplicates are skipped during bulk import using InChIKey when available, with canonical SMILES as the fallback.",
      "The browser batch is intentionally limited to 500 structures at once so the interface remains responsive. Split larger libraries into several files or use a future server-side pipeline for very large collections.",
    ],
    tips: [
      "A skipped duplicate is not an error. Review the Duplicate audit in Data tools if you intentionally maintain multiple records for one structure.",
      "CSV parsing in this version is intended for straightforward compound tables; preserve a source copy of complex vendor files.",
    ],
    icon: UploadIcon,
  },
  {
    id: "chemistry-registry",
    category: "Chemistry & cheminformatics",
    title: "Maintain a compound registry and detect duplicates",
    summary: "Every chemistry record can carry structure identifiers, project/series metadata, external IDs, tags, notes, and an optional OpenLab Registry link.",
    href: "/chemistry",
    action: "Open Compound library",
    steps: [
      "Open Compound library and select a record from the left list.",
      "Set the project and medicinal-chemistry series so compounds from one optimization program can be grouped.",
      "Use tags for workflow labels such as lead, control, intermediate, inactive, or resynthesis-needed.",
      "Record PubChem CID and ChEMBL ID only when you have verified the external identity. The quick links open those databases in a new tab.",
      "Choose Re-analyze with RDKit to refresh canonical SMILES/InChIKey and check whether the structure duplicates another registered record.",
      "Choose Register entity when you want the molecule to appear in the broader OpenLab Registry. The linked Registry metadata stores the chemistry compound ID, formula, InChIKey, and SMILES.",
      "Use Data tools → Duplicate audit to find exact duplicate groups already present in the chemistry library.",
    ],
    tips: [
      "Names are not reliable chemical identifiers. Prefer structure-derived identifiers for duplicate detection.",
      "Stereoisomers can have different structure identifiers; review stereochemistry rather than merging records solely because their names look similar.",
    ],
    icon: RegistryIcon,
  },
  {
    id: "chemistry-search",
    category: "Chemistry & cheminformatics",
    title: "Run similarity and SMARTS substructure searches",
    summary: "Search the lab's registered compounds by whole-molecule fingerprint similarity or by a chemical substructure pattern.",
    href: "/chemistry",
    action: "Open Structure search",
    steps: [
      "Open Chemistry → Structure search.",
      "For similarity search, choose the query compound from the compound library.",
      "Set the minimum Tanimoto threshold. A higher threshold requires a more similar fingerprint; a lower threshold returns a broader neighborhood.",
      "Choose Run similarity search. OpenLab calculates Morgan circular fingerprints with radius 2 and a 2048-bit length through RDKit, then calculates Tanimoto similarity in the browser.",
      "Results are sorted from most similar to least similar among compounds that meet the threshold.",
      "For substructure search, enter a SMARTS pattern or use one of the example motifs.",
      "Choose Search substructures. RDKit checks each compound graph and OpenLab displays matching molecules; highlighted depictions are used when the RDKit build returns match coordinates for rendering.",
      "Click a result to make it the active compound for the other chemistry tools.",
    ],
    tips: [
      "Fingerprint similarity depends on fingerprint settings and is not a direct measure of biological similarity.",
      "SMARTS is a query language, not ordinary SMILES. Broad SMARTS patterns can match many structures.",
    ],
    icon: SearchIcon,
  },
  {
    id: "chemistry-sar",
    category: "Chemistry & cheminformatics",
    title: "Build a structure–activity relationship (SAR) table",
    summary: "Link experimental potency or response measurements to compounds, targets, assays, endpoints, and sources without mixing them with calculated descriptors.",
    href: "/chemistry",
    action: "Open SAR",
    steps: [
      "Open Chemistry → SAR and choose Add activity.",
      "Select the compound, then enter the biological target, assay name/type, endpoint such as IC50/EC50/Kd, qualifier, numerical value, and unit.",
      "Keep units consistent when you intend to compare a series numerically. Do not compare 10 nM with 10 µM as if the numbers are equivalent.",
      "Use the Source and Notes fields in the data model when provenance or interpretation needs to be preserved; the activity record remains linked to its compound/project.",
      "Choose a molecular descriptor for the exploratory scatter plot. Only activity rows with both a numerical measurement and that RDKit descriptor are plotted.",
      "Treat the plot as a visual exploration only. OpenLab does not fit or validate a QSAR model in this view.",
      "When different targets, endpoints, assay formats, or units are present in one table, filter/interpret them as separate experimental contexts before drawing conclusions.",
    ],
    tips: [
      "OpenLab does not generate potency values. Enter measured or traceable source-derived activity data only.",
      "A correlation in a small SAR series is not evidence of causation or prospective predictive performance.",
    ],
    icon: ChemistryIcon,
  },
  {
    id: "chemistry-screening",
    category: "Chemistry & cheminformatics",
    title: "Use medicinal-chemistry screening filters",
    summary: "Screen the registered library with editable descriptor gates plus clearly labeled Lipinski-style and Veber-style heuristics.",
    href: "/chemistry",
    action: "Open Screening",
    steps: [
      "Open Chemistry → Screening.",
      "Confirm that compounds have RDKit descriptors. Records that have not been analyzed show Need RDKit rather than receiving a made-up result.",
      "Adjust maximum molecular weight, cLogP, TPSA, HBD, HBA, and rotatable-bond limits to match the purpose of your triage.",
      "Review the Custom column to see whether each compound passes all of the current user-defined gates.",
      "Review Lipinski-style violations separately. The reference checks use MW 500, cLogP 5, HBD 5, and HBA 10.",
      "Review the Veber-style display separately. This implementation uses rotatable bonds ≤10 and TPSA ≤140 Å² as a simple heuristic view.",
      "Use these outputs to prioritize manual review or downstream computation, not to label a molecule safe, effective, developable, or clinically viable.",
    ],
    tips: [
      "Drug-likeness heuristics are context-dependent and have well-known exceptions.",
      "This version does not silently run PAINS, toxicity, docking, or ADMET models under the word screening.",
    ],
    icon: ChemistryIcon,
  },
  {
    id: "chemistry-reactions",
    category: "Chemistry & cheminformatics",
    title: "Record reactions and calculate stoichiometry/yield",
    summary: "The Reaction Workbench records synthesis context and performs transparent unit calculations for mass, liquid volume, theoretical yield, and percent yield.",
    href: "/chemistry",
    action: "Open Reactions",
    steps: [
      "Open Chemistry → Reactions and create a new reaction record.",
      "Assign the project, solvent, temperature, reaction time, and optional reaction SMILES.",
      "Add Reactant, Reagent, Solvent, or Product rows as needed.",
      "For each component, enter the amount in mmol and molecular weight in g/mol. OpenLab calculates mass in mg using mmol × molecular weight.",
      "For a liquid, enter density in g/mL. OpenLab calculates approximate volume in µL as mass mg ÷ density g/mL.",
      "Enter the limiting-reagent amount in mmol and the product molecular weight. OpenLab calculates theoretical product mass.",
      "Enter isolated actual product mass to calculate percent yield.",
      "Record the experimental procedure, purification method, and analytical characterization such as LC-MS, NMR, HPLC, and purity.",
    ],
    tips: [
      "Check molecular weight, density, salt/solvate form, purity, and concentration before relying on an automatic quantity calculation.",
      "The Reaction Workbench is an electronic calculation/record system; it does not validate whether a chemical synthesis is safe or appropriate to perform.",
    ],
    icon: FlaskIcon,
  },
  {
    id: "chemistry-3d",
    category: "Chemistry & cheminformatics",
    title: "Inspect molecules and protein structures in 3D",
    summary: "The 3D & poses workspace uses 3Dmol.js to render coordinate-containing molecular files interactively in the browser.",
    href: "/chemistry",
    action: "Open 3D & poses",
    steps: [
      "Open Chemistry → 3D & poses.",
      "Upload or paste a PDB, SDF, MOL2, XYZ, CIF, or MOL coordinate record.",
      "Confirm the detected/selected file format.",
      "Choose Stick, Sphere + stick, Line, or Cartoon + stick rendering. Cartoon is most useful for macromolecular structures such as proteins.",
      "Enable Spin when you want continuous rotation, and use the 3D viewer's mouse controls to rotate/zoom interactively.",
      "You can load the currently selected compound's RDKit MOL block. Remember that RDKit's 2D depiction coordinates can appear flat in a 3D renderer.",
      "For a meaningful conformer, crystallographic structure, docking pose, or protein–ligand complex, upload data that actually contains 3D coordinates.",
    ],
    tips: [
      "The viewer does not create or validate docking poses.",
      "A visually plausible 3D orientation is not evidence of binding affinity.",
    ],
    icon: ChemistryIcon,
  },
  {
    id: "chemistry-admet",
    category: "Chemistry & cheminformatics",
    title: "Store ADMET, property predictions, and experimental measurements honestly",
    summary: "The ADMET & predictions ledger makes the evidence type and provenance explicit instead of presenting generated numbers as facts.",
    href: "/chemistry",
    action: "Open ADMET & predictions",
    steps: [
      "Open Chemistry → ADMET & predictions and choose Add record.",
      "Select the compound and set Kind to Experimental, Predicted, or Heuristic.",
      "Enter the property name such as solubility, permeability, logD, CYP inhibition, hERG, BBB penetration, clearance, PPB, or another endpoint.",
      "Enter the value and unit exactly as reported by the experiment/model/source.",
      "For a model prediction, enter the model/method name and version. This is essential for reproducibility because model outputs can change between versions.",
      "Use Provenance for a DOI, dataset, notebook experiment, external service, model run ID, or other traceable origin.",
      "Interpret predictions within the method's applicability domain. OpenLab stores the result; it does not imply the model is validated for your molecule class.",
    ],
    tips: [
      "Predicted ≠ experimentally measured.",
      "Do not enter an AI-generated number without a documented model/source and then label it Experimental.",
    ],
    icon: SparkIcon,
  },
  {
    id: "chemistry-export",
    category: "Chemistry & cheminformatics",
    title: "Export and move chemistry data between tools",
    summary: "Chemistry Data tools provide CSV and SDF exports while the global OpenLab backup preserves the full chemistry workspace with the rest of the lab data.",
    href: "/chemistry",
    action: "Open Data tools",
    steps: [
      "Open Chemistry → Data tools.",
      "Choose Export CSV for a tabular compound file containing OpenLab ID, name, canonical SMILES, InChI/InChIKey, formula, series, tags, and common RDKit descriptor columns.",
      "Choose Export SDF for compounds that have an RDKit MOL block. OpenLab writes selected metadata such as OpenLab ID, name, SMILES, InChIKey, series, and tags as SDF properties.",
      "Use Settings & sync → Export workspace when you need a complete OpenLab backup including compound records, activity data, reactions, predictions, notebook, projects, sequences, and other workspace objects.",
      "When moving data to another cheminformatics application, verify stereochemistry, charges, isotopes, salts, and property naming after import rather than assuming every tool interprets every field identically.",
    ],
    tips: [
      "Keep an immutable copy of important raw vendor/source files alongside normalized OpenLab data.",
      "SDF export requires a MOL block; re-analyze older SMILES-only records with RDKit first if needed.",
    ],
    icon: DatabaseIcon,
  },
  {
    id: "troubleshooting",
    category: "Troubleshooting",
    title: "Fix common problems",
    summary: "Use these checks before changing code or deleting data.",
    steps: [
      "Login says Failed to fetch: verify the Supabase project URL/key in Vercel and make sure the site's Content Security Policy permits the Supabase HTTPS and WebSocket origins.",
      "Cloud badge shows Sync issue: check network connectivity, the active Supabase session, the selected cloud workspace, and Row Level Security policies.",
      "Password reset email arrives but the link fails: check Supabase Authentication → URL Configuration and confirm the OpenLab deployment URL is allowed.",
      "Imported FASTA looks linear/circular incorrectly: remember that FASTA does not store topology; set topology manually or use an annotated GenBank record.",
      "Plasmid annotations look wrong after raw sequence replacement: verify annotation coordinates because editing the underlying sequence can invalidate previous positions.",
      "A record appears missing: use global search, then check the relevant list and cloud/local workspace selection before assuming it was deleted.",
      "Before destructive reset/deletion, export a workspace backup or confirm that the cloud copy is current.",
    ],
    icon: HelpIcon,
  },
]

const categories = ["All", "Getting started", "Core workflow", "Molecular biology", "Chemistry & cheminformatics", "Applications", "Evidence & Copilot", "System", "Troubleshooting"]

export default function HelpCenter() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return sections.filter(section => {
      if (category !== "All" && section.category !== category) return false
      if (!needle) return true
      const haystack = [section.title, section.summary, section.category, ...section.steps, ...(section.tips || [])].join(" ").toLowerCase()
      return haystack.includes(needle)
    })
  }, [query, category])

  return (
    <div className="pageBody helpManualPage">
      <div className="pageHeading helpManualHeading">
        <div>
          <div className="sectionEyebrow">OPENLAB HELP CENTER</div>
          <h1>How to use OpenLab</h1>
          <p>A detailed, step-by-step operating guide for the lab account, research workspaces, molecular biology, chemistry/cheminformatics, scientific evidence, cloud sync, backups, and troubleshooting.</p>
        </div>
        <Link href="/" className="ghostButton linkButton">Back to Home</Link>
      </div>

      <section className="surfaceCard helpStartCard">
        <div>
          <div className="sectionEyebrow">10-MINUTE START</div>
          <h2>New to OpenLab? Follow this order.</h2>
          <p>Sign in → choose your researcher profile → create a Project → record an experiment in Notebook → import or create molecular records → save scientific Evidence → connect recurring work to Workflows.</p>
        </div>
        <div className="helpStartActions">
          <Link href="/projects" className="primaryButton linkButton">Start with a project</Link>
          <Link href="/notebook" className="ghostButton linkButton">Create an experiment</Link>
          <Link href="/plasmids" className="ghostButton linkButton">Import DNA</Link>
          <Link href="/chemistry" className="ghostButton linkButton">Analyze a compound</Link>
        </div>
      </section>

      <div className="helpManualLayout">
        <aside className="helpManualSidebar surfaceCard">
          <div className="helpSearchBox">
            <SearchIcon size={17}/>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search help…" aria-label="Search help"/>
          </div>
          <div className="helpCategoryList">
            {categories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="helpSidebarNote">
            <strong>Need a specific page?</strong>
            <p>Most guides below include a button that opens the related OpenLab workspace directly.</p>
          </div>
        </aside>

        <main className="helpManualContent">
          <div className="helpResultsBar"><strong>{filtered.length} guide{filtered.length === 1 ? "" : "s"}</strong><span>{category === "All" ? "All topics" : category}{query ? ` · matching “${query}”` : ""}</span></div>

          {filtered.map((section, index) => {
            const Icon = section.icon
            return (
              <article className="surfaceCard helpGuideCard" id={section.id} key={section.id}>
                <div className="helpGuideHeader">
                  <div className="helpGuideIcon"><Icon size={20}/></div>
                  <div>
                    <span>{section.category}</span>
                    <h2>{section.title}</h2>
                    <p>{section.summary}</p>
                  </div>
                  {section.href && <Link href={section.href} className="ghostButton linkButton helpGuideAction">{section.action || "Open workspace"}</Link>}
                </div>

                <div className="helpSteps">
                  <div className="helpStepsTitle">Step by step</div>
                  {section.steps.map((step, stepIndex) => (
                    <div className="helpStepRow" key={`${section.id}-${stepIndex}`}>
                      <span>{stepIndex + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>

                {!!section.tips?.length && <div className="helpTips"><strong>Important</strong>{section.tips.map((tip, tipIndex) => <p key={`${section.id}-tip-${tipIndex}`}>{tip}</p>)}</div>}

                {index < filtered.length - 1 && <a className="helpBackTop" href="#top">Back to top ↑</a>}
              </article>
            )
          })}

          {!filtered.length && <div className="surfaceCard helpNoResults"><HelpIcon size={26}/><strong>No guide matches that search</strong><p>Try a broader word such as “sequence”, “compound”, “SMILES”, “password”, “cloud”, “primer”, or “workflow”.</p><button className="ghostButton" onClick={() => { setQuery(""); setCategory("All") }}>Show all guides</button></div>}
        </main>
      </div>
    </div>
  )
}
