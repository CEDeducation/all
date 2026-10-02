# OpenLab architecture

## Design goals

1. Small domain modules instead of one giant component.
2. Scientific calculations isolated from UI code.
3. Local-first operation, with cloud adapters at the boundary.
4. Explicit domain types instead of unstructured JSON in components.
5. No secret keys in browser code.
6. Every external integration can be replaced without changing the notebook/registry/inventory data model.

## Data path

`WorkspaceState` in `lib/types.ts` is the local domain model. `lib/storage.ts` persists it to `localStorage` and emits a single application change event. Notebook file bytes live in IndexedDB through `lib/file-store.ts`. Supabase synchronization is isolated in `lib/cloud.ts`.

This separation means a future server-first store can implement the same CRUD operations and replace local persistence incrementally.

## Molecular biology

`lib/sequence.ts` contains pure functions for parsing and calculations. UI components in `components/molecular/` do not contain scientific formulas. `MolecularWorkspace.tsx` coordinates records, selection and editing; the circular map is isolated in `CircularSequenceMap.tsx`.

When adding a scientific algorithm, put the deterministic logic in `lib/sequence.ts` (or a new focused library module) and keep rendering/input handling in components.

## Adding a new research entity

1. Add the domain type to `lib/types.ts`.
2. Add CRUD methods to `lib/storage.ts`.
3. Add the matching normalized Supabase table and RLS policy if it needs cloud persistence.
4. Build a focused workspace component.
5. Add navigation/route.
6. Add audit entries for mutations.

## External services

- Supabase: `lib/cloud.ts` and `supabase/migrations/`.
- AI synthesis: `app/api/copilot/route.ts` only.
- Browser files: `lib/file-store.ts`.

Do not call paid APIs directly from client components.

## v1.1 account and persistence flow

`AuthGate` is intentionally separate from the research workspaces. It owns the two-step entry flow (main account -> lab profile) and can be replaced later without touching molecular biology or notebook code.

- `lib/cloud.ts`: Supabase Auth, profile RPCs, workspace snapshots and private file storage.
- `lib/local-auth.ts`: offline-only fallback using PBKDF2-derived local password/PIN hashes.
- `lib/lab-session.ts`: active workspace/profile identity shared by the UI and audit layer.
- `components/CloudAutoSync.tsx`: remote hydration plus debounced structured-data and attachment persistence.
- `components/ResumeLocation.tsx`: per-profile last-route restoration.

The current Netflix-style profile layer lives under one main authentication principal. If a future deployment needs private records that other lab members must be cryptographically unable to read, use individual Supabase Auth users and RLS policies rather than relying on profile PINs.

## v1.8 chemistry boundary

Chemistry follows the same separation used by Molecular biology:

- `lib/rdkit.ts` owns lazy loading of the self-hosted RDKit WebAssembly runtime and the lifecycle of RDKit molecule/query objects.
- `lib/chemistry.ts` contains pure import/export, descriptor mapping, fingerprint similarity, screening and reaction calculation helpers that do not depend on React.
- `components/ChemistryWorkspace.tsx` coordinates chemistry records and user interaction.
- `components/chemistry/Molecule2D.tsx` renders RDKit SVG safely as an image data URL rather than injecting user-controlled SVG markup into the DOM.
- `components/chemistry/Molecule3DViewer.tsx` lazy-loads 3Dmol.js only when the 3D workspace is used.

The WorkspaceState format identifier remains `openlab-workspace-v1` for backward compatibility. `storage.normalize()` supplies empty chemistry arrays when older v1 exports do not contain the new fields.

Chemistry data uses the existing local-first snapshot mechanism. No new Supabase table is required for v1.8 because the current cloud layer synchronizes the normalized structured workspace snapshot as a whole. If OpenLab later moves high-volume compound libraries into first-class SQL tables, those tables should use workspace-scoped RLS and should not bypass the existing authorization model.

### Third-party runtime policy

OpenLab self-hosts RDKit's official JS/WASM assets copied from the pinned npm package during `postinstall`; it does not fetch executable chemistry code from a CDN at runtime. 3Dmol.js is bundled as an npm dependency and loaded dynamically in the client only on the 3D page.

Do not add a chemistry package solely for a visual demo. New engines should have a clear scientific role, pinned version/license, provenance in `THIRD_PARTY.md`, and a failure mode that does not fabricate a result.
