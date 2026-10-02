# Chemistry & cheminformatics implementation notes

OpenLab v1.8 adds a dedicated chemistry workspace while keeping experimental measurements, deterministic calculations, model predictions, and heuristic filters explicitly separated.

## Open-source engines

### RDKit.js

OpenLab uses the official `@rdkit/rdkit` JavaScript/WebAssembly distribution (MinimalLib) for browser-side cheminformatics. The deployment postinstall script copies `RDKit_minimal.js` and `RDKit_minimal.wasm` from the npm package into `public/rdkit/`; `lib/rdkit.ts` loads that self-hosted runtime on demand.

OpenLab currently uses RDKit for:

- parsing SMILES, MOL blocks, and SDF-derived MOL blocks;
- canonical SMILES;
- CXSMILES when available;
- InChI and InChIKey when supported by the build;
- V2000 MOL blocks;
- SVG 2D depiction;
- molecular descriptors exposed by MinimalLib;
- Morgan circular fingerprints;
- SMARTS substructure matching and match highlighting.

Every `JSMol`/query object created by OpenLab is deleted in a `finally` block to release the underlying WebAssembly/C++ object.

## Similarity search

The browser search generates RDKit Morgan bit fingerprints with radius 2 and fingerprint length 2048 (`fplen: 2048`). OpenLab calculates Tanimoto similarity from the packed byte arrays:

`Tanimoto = popcount(A AND B) / popcount(A OR B)`

Similarity is a fingerprint-dependent mathematical measure. It is not a direct statement of equal biological activity, mechanism, safety, or synthetic accessibility.

## Substructure search

SMARTS input is parsed as an RDKit query molecule. Registered compounds are tested with RDKit substructure matching. Invalid query patterns return an error instead of being treated as a valid search.

## Descriptors

The UI reads available values from RDKit's descriptor JSON. Common fields displayed by OpenLab include:

- average molecular weight (`amw`);
- exact molecular weight (`exactmw`);
- Crippen cLogP (`CrippenClogP`);
- topological polar surface area (`tpsa`);
- hydrogen-bond donors/acceptors (`NumHBD`, `NumHBA` with Lipinski fallbacks);
- rotatable bonds (`NumRotatableBonds`);
- total/aromatic rings;
- fraction Csp3.

The molecular formula display is derived from the InChI formula layer when an InChI is available. It should not be interpreted as an independently measured property.

## Drug-likeness / triage heuristics

OpenLab exposes configurable property gates. It also shows two reference heuristics separately:

- Lipinski-style: MW ≤ 500, cLogP ≤ 5, HBD ≤ 5, HBA ≤ 10.
- Veber-style display: rotatable bonds ≤ 10 and TPSA ≤ 140 Å².

These are triage heuristics. They are not ADMET models and do not establish clinical developability.

## SAR

Activity values are user-entered records. OpenLab never fabricates potency. The exploratory descriptor-vs-activity scatter plot is a visualization only; it is not a fitted, cross-validated, or prospective QSAR model. Mixed targets, endpoints, assay formats, and units should be interpreted separately.

## Reactions

Transparent calculations used in the Reaction Workbench:

- `mass_mg = amount_mmol × molecular_weight_g_per_mol`
- `volume_uL = mass_mg / density_g_per_mL`
- `theoretical_yield_mg = limiting_mmol × product_molecular_weight_g_per_mol`
- `yield_percent = actual_product_mg / theoretical_yield_mg × 100`

Researchers must still verify salt/solvate form, concentration, purity, density, molecular weight, limiting reagent assignment, and units.

## 3Dmol.js

The 3D & poses page uses the `3dmol` npm package. It can render coordinate-containing PDB, SDF/MOL, MOL2, XYZ, and CIF data using interactive stick, sphere, line, or cartoon-oriented styles.

OpenLab does not generate or validate docking poses in v1.8. Loading a 2D RDKit MOL block into a 3D viewer can produce a planar display. Meaningful conformers or protein–ligand poses require real 3D coordinates from an appropriate source/workflow.

## ADMET / predictions

v1.8 provides a provenance ledger, not a hidden prediction model. Every property record is labelled as `Experimental`, `Predicted`, or `Heuristic` and can store method, model/version, and provenance. OpenLab does not invent missing values.

## Import/export

- Single structure: SMILES text, MOL block, or one SDF record via Structure Lab.
- Bulk: SMILES list, straightforward CSV with a SMILES/structure column, or multi-record SDF.
- Browser batch limit: 500 records per import.
- Exact duplicate screening: InChIKey when available, then canonical SMILES fallback.
- Export: CSV and SDF plus the global full-workspace JSON backup.

## Current boundaries

The v1.8 chemistry workspace intentionally does **not** claim to provide:

- a validated docking/scoring engine;
- conformer generation/energy minimization in the browser;
- validated ADMET/QSAR models;
- retrosynthesis planning;
- reaction condition prediction;
- a full commercial chemical registration system;
- a graphical bond-by-bond sketcher.

Those can be integrated as separate, versioned engines later. They should not be simulated with placeholder scores.
