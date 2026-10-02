import { copyFile, mkdir, access } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const sourceDir = path.join(root, "node_modules", "@rdkit", "rdkit", "dist")
const targetDir = path.join(root, "public", "rdkit")

await mkdir(targetDir, { recursive: true })
for (const name of ["RDKit_minimal.js", "RDKit_minimal.wasm"]) {
  const source = path.join(sourceDir, name)
  await access(source)
  await copyFile(source, path.join(targetDir, name))
}
console.log("OpenLab: copied RDKit.js runtime into public/rdkit")
