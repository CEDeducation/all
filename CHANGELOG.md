# Changelog

## v1.8.0 — Chemistry & cheminformatics

- Added a dedicated Chemistry workspace without adding more large sections to the intentionally minimal Home page.
- Added official RDKit.js/WebAssembly runtime (`@rdkit/rdkit` 2026.3.6) with self-hosted deployment assets.
- Production CSP explicitly permits WebAssembly compilation via `wasm-unsafe-eval` without enabling unrestricted JavaScript `unsafe-eval`.
- Added compound records with canonical SMILES, InChI/InChIKey, MOL blocks, formula display, series/tags, external IDs, notes, projects and RDKit descriptor cache.
- Added exact-duplicate warnings/audit using InChIKey with canonical-SMILES fallback.
- Added Structure Lab for SMILES/MOL/SDF parsing, RDKit 2D depiction, normalization, descriptors and fingerprint generation.
- Added Morgan radius-2 / 2048-bit fingerprint similarity search with browser-side Tanimoto scoring.
- Added SMARTS substructure search with RDKit match highlighting.
- Added SAR activity records plus an explicitly exploratory property-vs-activity plot.
- Added activity provenance fields (source/DOI and notes) directly in the SAR table.
- Added configurable property filters plus separately labeled Lipinski-style and Veber-style heuristics.
- Added Reaction Workbench for stoichiometry, mass/volume calculations, theoretical yield, actual yield, procedure, purification and analytical notes.
- Reaction components can link directly to registered compounds and inherit the compound name, SMILES and RDKit molecular weight.
- Added 3D & poses workspace powered by 3Dmol.js 2.5.5 for PDB/SDF/MOL/MOL2/XYZ/CIF visualization.
- Added ADMET/property provenance ledger separating Experimental, Predicted and Heuristic data.
- Added SMILES/CSV/MOL/SDF bulk import, 500-record browser batch guard, CSV/SDF export and duplicate audit.
- Added compound/reaction records to global search and Chemistry to Core navigation.
- Added detailed Chemistry & cheminformatics Help category and `docs/CHEMISTRY.md`.
- Extended WorkspaceState/storage normalization so older v1 exports load with empty chemistry arrays and new chemistry state participates in the existing workspace autosave/cloud snapshot path.

# OpenLab changelog

## v1.5

- Rebuilt the home page to be substantially less crowded.
- Removed the full-height Copilot column from Home; Copilot remains in the Evidence workflow.
- Added compact workspace overview, recent experiments/sequences, recent activity, and four application launchers.
- Removed the Inventory page/component from the application surface.
- Kept v1.4 Bioresearch, Bioprocess, Automation, and In Vivo data models and persistence.
- Re-ran source syntax, local import, CSS parser, sequence/scientific smoke, and CSP generation checks.

## v1.4.0
- Replaced the previous marketing-only Bioresearch/Bioprocess/Automation/In Vivo cards with four working application modules.
- Bioresearch now includes structured assay-run data capture and summary metrics.
- Bioprocess now includes recipe design, condition/replicate study planning, guided batch execution, and process insight summaries.
- Automation now includes a persistent visual flow builder and run history. Hardware connectors are represented honestly as adapter points; unsupported instruments are not claimed as connected.
- In Vivo now includes study design, cohorts, planned animals, and guided records for dosing, measurements, samples, and observations.
- All four modules persist in the OpenLab workspace state and therefore participate in existing local autosave and Supabase workspace snapshot sync.
- Kept Inventory out of the visible navigation as requested.
- Kept the v1.3 plasmid-map interaction and Help Center work.
- CSP now derives the allowed Supabase HTTP/WebSocket origin from `NEXT_PUBLIC_SUPABASE_URL`, avoiding project-specific hardcoding.

## v1.6
- Added a Supabase-backed Forgot password flow to the main cloud login.
- Added recovery-link handling and secure password update support.
- Simplified the home page again: removed metrics, activity feed, utility row, and extra promotional blocks.
- Home now contains only a welcome header, recent work, and four application shortcuts.

## v1.7 — Detailed Help Center
- Replaced the short Help page with a searchable, categorized operating manual.
- Added step-by-step guides for accounts, profiles, password recovery, navigation, Projects, Notebook, Protocols, Registry, Molecular Biology, Bioresearch, Bioprocess, Automation, In Vivo, Workflows, Evidence/Copilot, Activity, cloud sync, backups, data storage, and troubleshooting.
- Added direct links from help topics into the relevant OpenLab workspaces.
- Added molecular-specific instructions for import, plasmid interaction, annotations, motif search, raw DNA editing, primers/PCR, restriction analysis, ORFs, and export.
