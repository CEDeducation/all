import type { WorkspaceState } from "./types"

const now = "2026-10-01T00:00:00.000Z"
const pUC19 = "TCGCGCGTTTCGGTGATGACGGTGAAAACCTCTGACACATGCAGCTCCCGGAGACGGTCACAGCTTGTCTGTAAGCGGATGCCGGGAGCAGACAAGCCCGTCAGGGCGCGTCAGCGGGTGTTGGCGGGTGTCGGGGCTGGCTTAACTATGCGGCATCAGAGCAGATTGTACTGAGAGTGCACCATATGCGGTGTGAAATACCGCACAGATGCGTAAGGAGAAAATACCGCATCAGGCGCCATTCGCCATTCAGGCTGCGCAACTGTTGGGAAGGGCGATCGGTGCGGGCCTCTTCGCTATTACGCCAGCTGGCGAAAGGGGGATGTGCTGCAAGGCGATTAAGTTGGGTAACGCCAGGGTTTTCCCAGTCACGACGTTGTAAAACGACGGCCAGTGAATTCGAGCTCGGTACCCGGGGATCCTCTAGAGTCGACCTGCAGGCATGCAAGCTTGGCGTAATCATGGTCATAGCTGTTTCCTGTGTGAAATTGTTATCCGCTCACAATTCCACACAACATACGAGCCGGAAGCATAAAGTGTAAAGCCTGGGGTGCCTAATGAGTGAGCTAACTCACATTAATTGCGTTGCGCTCACTGCCCGCTTTCCAGTCGGGAAACCTGTCGTGCCAGCTGCATTAATGAATCGGCCAACGCGCGGGGAGAGGCGGTTTGCGTATTGGGCGCTCTTCCGCTTCCTCGCTCACTGACTCGCTGCGCTCGGTCGTTCGGCTGCGGCGAGCGGTATCAGCTCACTCAAAGGCGGTAATACGGTTATCCACAGAATCAGGGGATAACGCAGGAAAGAACATGTGAGCAAAAGGCCAGCAAAAGGCCAGGAACCGTAAAAAGGCCGCGTTGCTGGCGTTTTTCCATAGGCTCCGCCCCCCTGACGAGCATCACAAAAATCGACGCTCAAGTCAGAGGTGGCGAAACCCGACAGGACTATAAAGATACCAGGCGTTTCCCCCTGGAAGCTCCCTCGTGCGCTCTCCTGTTCCGACCCTGCCGCTTACCGGATACCTGTCCGCCTTTCTCCCTTCGGGAAGCGTGGCGCTTTCTCATAGCTCACGCTGTAGGTATCTCAGTTCGGTGTAGGTCGTTCGCTCCAAGCTGGGCTGTGTGCACGAACCCCCCGTTCAGCCCGACCGCTGCGCCTTATCCGGTAACTATCGTCTTGAGTCCAACCCGGTAAGACACGACTTATCGCCACTGGCAGCAGCCACTGGTAACAGGATTAGCAGAGCGAGGTATGTAGGCGGTGCTACAGAGTTCTTGAAGTGGTGGCCTAACTACGGCTACACTAGAAGAACAGTATTTGGTATCTGCGCTCTGCTGAAGCCAGTTACCTTCGGAAAAAGAGTTGGTAGCTCTTGATCCGGCAAACAAACCACCGCTGGTAGCGGTGGTTTTTTTGTTTGCAAGCAGCAGATTACGCGCAGAAAAAAAGGATCTCAAGAAGATCCTTTGATCTTTTCTACGGGGTCTGACGCTCAGTGGAACGAAAACTCACGTTAAGGGATTTTGGTCATGAGATTATCAAAAAGGATCTTCACCTAGATCCTTTTAAATTAAAAATGAAGTTTTAAATCAATCTAAAGTATATATGAGTAAACTTGGTCTGACAGTTACCAATGCTTAATCAGTGAGGCACCTATCTCAGCGATCTGTCTATTTCGTTCATCCATAGTTGCCTGACTCCCCGTCGTGTAGATAACTACGATACGGGAGGGCTTACCATCTGGCCCCAGTGCTGCAATGATACCGCGAGACCCACGCTCACCGGCTCCAGATTTATCAGCAATAAACCAGCCAGCCGGAAGGGCCGAGCGCAGAAGTGGTCCTGCAACTTTATCCGCCTCCATCCAGTCTATTAATTGTTGCCGGGAAGCTAGAGTAAGTAGTTCGCCAGTTAATAGTTTGCGCAACGTTGTTGCCATTGCTACAGGCATCGTGGTGTCACGCTCGTCGTTTGGTATGGCTTCATTCAGCTCCGGTTCCCAACGATCAAGGCGAGTTACATGATCCCCCATGTTGTGCAAAAAAGCGGTTAGCTCCTTCGGTCCTCCGATCGTTGTCAGAAGTAAGTTGGCCGCAGTGTTATCACTCATGGTTATGGCAGCACTGCATAATTCTCTTACTGTCATGCCATCCGTAAGATGCTTTTCTGTGACTGGTGAGTACTCAACCAAGTCATTCTGAGAATAGTGTATGCGGCGACCGAGTTGCTCTTGCCCGGCGTCAATACGGGATAATACCGCGCCACATAGCAGAACTTTAAAAGTGCTCATCATTGGAAAACGTTCTTCGGGGCGAAAACTCTCAAGGATCTTACCGCTGTTGAGATCCAGTTCGATGTAACCCACTCGTGCACCCAACTGATCTTCAGCATCTTTTACTTTCACCAGCGTTTCTGGGTGAGCAAAAACAGGAAGGCAAAATGCCGCAAAAAAGGGAATAAGGGCGACACGGAAATGTTGAATACTCATACTCTTCCTTTTTCAATATTATTGAAGCATTTATCAGGGTTATTGTCTCATGAGCGGATACATATTTGAATGTATTTAGAAAAATAAACAAATAGGGGTTCCGCGCACATTTCCCCGAAAAGTGCCACCTGACGTCTAAGAAACCATTATTATCATGACATTAACCTATAAAAATAGGCGTATCACGAGGCCCTTTCGTC"

export const starterWorkspace: WorkspaceState = {
  format: "openlab-workspace-v1",
  workspace: { id: "ws_local", name: "My Lab", createdAt: now, updatedAt: now },
  projects: [
    { id: "project_general", name: "General research", description: "Default project for unclassified work.", status: "Active", createdAt: now, updatedAt: now },
  ],
  notebook: [],
  protocols: [],
  registry: [
    {
      id: "entity_puc19", name: "pUC19", type: "DNA", schema: "Plasmid",
      description: "Starter reference sequence included so the molecular editor can be tested immediately.",
      aliases: ["pUC19 reference"], sequenceId: "seq_puc19", metadata: { accession: "L09137.2" },
      createdAt: now, updatedAt: now,
    },
  ],
  inventory: [],
  sequences: [
    {
      id: "seq_puc19", name: "pUC19", sequence: pUC19, topology: "Circular", moleculeType: "DNA",
      accession: "L09137.2", sourceLabel: "NCBI reference accession L09137.2",
      sourceUrl: "https://www.ncbi.nlm.nih.gov/nuccore/L09137.2", updatedAt: now,
      features: [
        { id: "f_lacz", name: "lacZα", type: "CDS", start: 145, end: 468, direction: -1, color: "#7257c7" },
        { id: "f_mcs", name: "MCS", type: "misc_feature", start: 395, end: 451, direction: 1, color: "#d8942f" },
        { id: "f_lacop", name: "lac operator", type: "regulatory", start: 488, end: 504, direction: 1, color: "#2e9b74" },
        { id: "f_lacprom", name: "lac promoter", type: "promoter", start: 512, end: 542, direction: -1, color: "#3b86b2" },
        { id: "f_ori", name: "pMB1/ColE1 origin", type: "rep_origin", start: 866, end: 1454, direction: -1, color: "#d3b32e" },
        { id: "f_ampr", name: "bla (AmpR)", type: "CDS", start: 1625, end: 2485, direction: -1, color: "#61af6d" },
      ],
      primers: [],
      notes: "Starter reference. Replace or delete it when creating your own workspace.",
    },
  ],
  tasks: [],
  assayRuns: [
    {
      id: "assay_demo",
      name: "EGFR inhibitor viability screen",
      assayType: "Cell viability",
      projectId: "project_general",
      status: "Complete",
      measurements: [
        { id: "m1", sample: "Vehicle", metric: "Viability", value: 100, unit: "%" },
        { id: "m2", sample: "Compound A 1 µM", metric: "Viability", value: 63.4, unit: "%" },
        { id: "m3", sample: "Compound A 10 µM", metric: "Viability", value: 28.7, unit: "%" },
      ],
      updatedAt: now,
    },
  ],
  bioprocessRecipes: [
    {
      id: "recipe_demo",
      name: "Fed-batch cell culture",
      description: "Starter process-development recipe showing unit operations and parameters.",
      published: false,
      unitOperations: [
        { id: "uo1", name: "Seed expansion", equipment: "Shake flask", parameters: [{ id: "p1", name: "Temperature", value: "37", unit: "°C" }], steps: ["Prepare inoculum", "Expand seed culture"] },
        { id: "uo2", name: "Production culture", equipment: "Bioreactor", parameters: [{ id: "p2", name: "pH", value: "7.0", unit: "" }, { id: "p3", name: "Temperature", value: "37", unit: "°C" }], steps: ["Inoculate vessel", "Start feed strategy", "Monitor process"] },
        { id: "uo3", name: "Harvest", equipment: "Centrifuge", parameters: [], steps: ["Clarify harvest", "Record final yield"] },
      ],
      updatedAt: now,
    },
  ],
  bioprocessStudies: [],
  automationFlows: [
    {
      id: "flow_demo",
      name: "Plate reader → analysis → notebook",
      nodes: [
        { id: "an1", type: "Instrument input", label: "Plate reader file", config: "CSV/XLSX import" },
        { id: "an2", type: "Transform", label: "Normalize controls", config: "Normalize to vehicle control" },
        { id: "an3", type: "Analysis", label: "Calculate summary", config: "Mean and QC checks" },
        { id: "an4", type: "Notebook output", label: "Attach result", config: "Write analysis summary to experiment" },
      ],
      runs: [],
      updatedAt: now,
    },
  ],
  inVivoStudies: [
    {
      id: "invivo_demo",
      name: "Example tolerability study",
      species: "Mouse",
      status: "Planning",
      groups: [
        { id: "g1", name: "Vehicle", treatment: "Vehicle control" },
        { id: "g2", name: "Treatment", treatment: "Candidate compound" },
      ],
      animals: [],
      events: [],
      updatedAt: now,
    },
  ],
  chemistryCompounds: [
    {
      id: "chem_aspirin", name: "Aspirin", projectId: "project_general", sourceFormat: "SMILES",
      structureInput: "CC(=O)OC1=CC=CC=C1C(=O)O", smiles: "CC(=O)OC1=CC=CC=C1C(=O)O", canonicalSmiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
      inchi: "", inchiKey: "", formula: "C9H8O4", molblock: "", descriptors: {}, tags: ["reference"], series: "Starter references",
      notes: "Reference structure included to test the Chemistry workspace. Re-analyze with RDKit to populate computed identifiers and descriptors.", externalIds: {}, createdAt: now, updatedAt: now,
    },
    {
      id: "chem_caffeine", name: "Caffeine", projectId: "project_general", sourceFormat: "SMILES",
      structureInput: "Cn1c(=O)c2c(ncn2C)n(C)c1=O", smiles: "Cn1c(=O)c2c(ncn2C)n(C)c1=O", canonicalSmiles: "Cn1c(=O)c2c(ncn2C)n(C)c1=O",
      inchi: "", inchiKey: "", formula: "C8H10N4O2", molblock: "", descriptors: {}, tags: ["reference"], series: "Starter references",
      notes: "Reference structure included to test the Chemistry workspace. Re-analyze with RDKit to populate computed identifiers and descriptors.", externalIds: {}, createdAt: now, updatedAt: now,
    },
  ],
  chemistryActivities: [],
  chemistryReactions: [],
  chemistryPredictions: [],
  sources: [],
  copilotThreads: [],
  audit: [
    { id: "audit_seed", actor: "system", action: "workspace.created", objectType: "workspace", objectId: "ws_local", detail: "Workspace initialized", createdAt: now },
  ],
  members: [{ id: "local_user", email: "", displayName: "Local user", role: "owner" }],
}
