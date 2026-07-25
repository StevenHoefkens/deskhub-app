import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { gzipSync } from 'node:zlib'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS_DIR = join(ROOT, 'dist', 'assets')

const BYTES_PER_KB = 1024
const TOTAL_JS_GZIP_BUDGET_BYTES = 200 * BYTES_PER_KB
const PER_CHUNK_GZIP_BUDGET_BYTES = 50 * BYTES_PER_KB

function gzippedSize(path) {
  return gzipSync(readFileSync(path)).length
}

function main() {
  if (!existsSync(ASSETS_DIR)) {
    console.error(`No build output at ${ASSETS_DIR}. Run the build first.`)
    process.exit(1)
  }

  const jsFiles = readdirSync(ASSETS_DIR).filter((name) => name.endsWith('.js'))
  let total = 0
  const overSizedChunks = []

  for (const name of jsFiles) {
    const size = gzippedSize(join(ASSETS_DIR, name))
    total += size
    const kb = (size / BYTES_PER_KB).toFixed(1)
    console.log(`${name}: ${kb} KB gzipped`)
    if (size > PER_CHUNK_GZIP_BUDGET_BYTES) overSizedChunks.push({ name, size })
  }

  console.log(
    `Total JS: ${(total / BYTES_PER_KB).toFixed(1)} KB gzipped (budget ${TOTAL_JS_GZIP_BUDGET_BYTES / BYTES_PER_KB} KB)`,
  )

  for (const { name, size } of overSizedChunks) {
    console.warn(
      `WARN: chunk ${name} is ${(size / BYTES_PER_KB).toFixed(1)} KB gzipped, above the ${PER_CHUNK_GZIP_BUDGET_BYTES / BYTES_PER_KB} KB per-chunk guideline — consider splitting.`,
    )
  }

  if (total > TOTAL_JS_GZIP_BUDGET_BYTES) {
    console.error(
      `Bundle budget exceeded: total JS ${(total / BYTES_PER_KB).toFixed(1)} KB gzipped > ${TOTAL_JS_GZIP_BUDGET_BYTES / BYTES_PER_KB} KB.`,
    )
    process.exit(1)
  }

  console.log('Bundle budget OK.')
}

main()
