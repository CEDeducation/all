# Third-party and open-source components

OpenLab's product UI, workflows, persistence layer and application logic are original OpenLab code. No Benchling source code, proprietary icons, screenshots, or other proprietary assets are bundled.

## Runtime frameworks

- Next.js 14.2.35
- React 18.3.1
- React DOM 18.3.1

## Chemistry / cheminformatics

### RDKit / RDKit.js

- Package: `@rdkit/rdkit` 2026.3.6
- Project: https://github.com/rdkit/rdkit and https://github.com/rdkit/rdkit-js
- License: BSD-3-Clause
- Use in OpenLab: SMILES/MOL parsing, canonical identifiers, 2D SVG depiction, descriptors, Morgan fingerprints, SMARTS substructure matching, and local browser-side WebAssembly chemistry calculations.

The postinstall script copies the official package's `RDKit_minimal.js` and `RDKit_minimal.wasm` into OpenLab's own public assets. OpenLab does not modify or redistribute hidden proprietary chemistry code.

### 3Dmol.js

- Package: `3dmol` 2.5.5
- Project: https://github.com/3dmol/3Dmol.js
- License: BSD-3-Clause
- Use in OpenLab: interactive molecular coordinate visualization for formats such as PDB, SDF/MOL, MOL2, XYZ and CIF.

## Reference data

The bundled pUC19 files under `public/reference/` are included as sequence/import-test reference data. Review source/provenance requirements before redistributing reference sequence records in another product context.
