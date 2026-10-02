# OpenLab v1.8

OpenLab is a local-first collaborative research operating system for academic wet-lab and dry-lab teams. v1.8 preserves the account/profile, notebook, molecular biology, evidence, workflow and application functionality from v1.7 and adds a real Chemistry & Cheminformatics workspace powered by open-source chemistry engines.

## Product areas

- **Home** — intentionally minimal: welcome actions, recent work, and compact application launchers. Chemistry was not added as another large Home block.
- **Bioresearch** — structured assay runs and numerical measurement capture.
- **Bioprocess** — process recipes, study conditions/replicates, guided batch execution, and process observations.
- **Automation** — persistent workflow builder and run history. Physical instruments still require vendor-specific connectors.
- **In Vivo** — study design, groups, animals, and dose/measurement/sample/observation events.
- **Notebook** — experiment records, links, tags, procedures, observations, results, and attachments.
- **Protocols / Registry / Workflows** — reusable methods, scientific entities, and team tasks.
- **Molecular biology** — FASTA/GenBank/CSV/TSV/JSON import, circular/linear maps, annotations, primers, restriction analysis, ORFs, in-silico PCR, and export.
- **Chemistry & cheminformatics** — RDKit structure analysis, compound registry, similarity/substructure search, SAR, property screening, reaction calculations, 3D viewing, ADMET/prediction provenance, and bulk import/export.
- **Evidence + Scientific Copilot** — allow-listed scientific evidence retrieval with source-bounded synthesis.
- **Activity / Help / Settings & sync** — audit history, detailed operating manual, backups and cloud controls.

Inventory remains removed from visible product navigation. The legacy inventory field remains in the workspace data shape so older exports do not break.

## Chemistry stack

v1.8 adds:

- `@rdkit/rdkit` `2026.3.6` — official RDKit JavaScript/WebAssembly MinimalLib distribution.
- `3dmol` `2.5.5` — interactive WebGL molecular visualization.

`npm install` runs `scripts/copy-rdkit-assets.mjs`, which self-hosts RDKit's JavaScript/WASM runtime under `public/rdkit/`. This avoids a required chemistry CDN at runtime.

See `docs/CHEMISTRY.md` for calculation details, provenance rules, and scientific limitations.

## Chemistry features

1. **Compound library** — project/series/tags, SMILES, InChI/InChIKey, formula, external IDs, notes, RDKit descriptors, Registry handoff, duplicate warnings.
2. **Structure Lab** — parse SMILES/MOL/SDF, render 2D SVG, canonicalize, calculate descriptors/fingerprint, and save a normalized compound.
3. **Structure search** — Morgan radius-2 2048-bit fingerprint similarity with Tanimoto ranking, plus SMARTS substructure search.
4. **SAR** — compound-linked measured activity records and an explicitly exploratory descriptor/activity plot.
5. **Screening** — editable descriptor filters, plus clearly labeled Lipinski-style and Veber-style heuristic summaries.
6. **Reactions** — reactant/reagent/product records, mmol/MW/density calculations, theoretical/actual yield, procedure, purification and analytical notes.
7. **3D & poses** — PDB/SDF/MOL/MOL2/XYZ/CIF rendering with 3Dmol.js. No fabricated docking poses.
8. **ADMET & predictions** — evidence ledger distinguishing Experimental, Predicted, and Heuristic values with method/version/provenance.
9. **Data tools** — SMILES/CSV/MOL/SDF import, duplicate audit, CSV export and SDF export.

## Persistence and accounts

OpenLab is local-first. Structured workspace state is kept in browser storage and notebook attachment bytes use IndexedDB. When Supabase is configured, the application uses Supabase Auth, RLS-protected workspaces, private file storage, researcher profiles/PIN verification, background workspace snapshot sync and history.

Required public deployment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the browser-safe publishable/anon key, never a secret/service-role key)

The production Content Security Policy derives the allowed Supabase HTTPS/WebSocket origins from `NEXT_PUBLIC_SUPABASE_URL` and permits RDKit WebAssembly compilation with `wasm-unsafe-eval` while keeping general JavaScript `unsafe-eval` disabled in production.

## Source layout

- `app/` — Next.js routes.
- `components/` — application workspaces.
- `components/molecular/` — sequence UI.
- `components/chemistry/` — chemistry depictions/3D viewer.
- `lib/types.ts` — domain model.
- `lib/storage.ts` — local structured-data persistence.
- `lib/cloud.ts` — Supabase auth/sync/storage adapter.
- `lib/sequence.ts` — sequence parsing/calculations.
- `lib/rdkit.ts` — RDKit WASM loader and chemistry engine adapter.
- `lib/chemistry.ts` — pure chemistry import/export, descriptor, screening, similarity and stoichiometry helpers.
- `scripts/copy-rdkit-assets.mjs` — deployment asset copy step.
- `supabase/migrations/` — cloud schema/RLS/profile/history setup.
- `docs/` — architecture, scientific methods and chemistry method notes.

## Build / QA note

The source package includes static checks, but a real `npm install && npm run build` in Vercel/CI remains the final integration test because RDKit and 3Dmol dependencies must be installed there. Do not treat a source parse check as a successful production build.
