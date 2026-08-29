/**
 * Validates every DISCOM tariff JSON in this folder against TariffFileSchema.
 * Run with:  npx tsx src/data/tariffs/_validate.ts
 */
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { safeParseTariffFile } from './_schema'

const here = dirname(fileURLToPath(import.meta.url))
const files = readdirSync(here).filter(
  (f) => f.endsWith('.json') && !f.startsWith('_'),
)

let failures = 0
for (const file of files) {
  const data = require(join(here, file))
  const result = safeParseTariffFile(data)
  if (result.success) {
    console.log(`✅ ${file} is valid`)
  } else {
    failures++
    console.error(`❌ ${file} failed validation:`)
    console.error(JSON.stringify(result.error.format(), null, 2))
  }
}

if (failures > 0) {
  console.error(`\n${failures} file(s) failed.`)
  process.exit(1)
}
console.log(`\nAll ${files.length} tariff file(s) valid.`)
