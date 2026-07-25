import { readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import openapiTS, { astToString } from 'openapi-typescript'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTRACTS_DIR = join(ROOT, '.flowforge', 'contracts')
const OUT_DIR = join(ROOT, 'src', 'types', 'contracts')
const CONTRACT_FILE = 'contract.openapi.yml'
const HEADER = '// AUTO-GENERATED from the materialized contract snapshot. Do not edit.\n'

function discoverContracts() {
  if (!existsSync(CONTRACTS_DIR)) return []
  return readdirSync(CONTRACTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ uc: entry.name, file: join(CONTRACTS_DIR, entry.name, CONTRACT_FILE) }))
    .filter(({ file }) => existsSync(file))
}

async function main() {
  const contracts = discoverContracts()
  if (contracts.length === 0) {
    console.error(`No contracts found under ${CONTRACTS_DIR}`)
    process.exit(1)
  }
  mkdirSync(OUT_DIR, { recursive: true })
  for (const { uc, file } of contracts) {
    const ast = await openapiTS(pathToFileURL(file))
    const outFile = join(OUT_DIR, `${uc.toLowerCase()}.ts`)
    writeFileSync(outFile, HEADER + astToString(ast))
    console.log(`generated ${outFile} from ${uc}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
