import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const p = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../data/acppbAbuCatalog17to66.ts'
)
let s = fs.readFileSync(p, 'utf8')
const start = s.indexOf("id: 'abu-65'")
const end = s.indexOf("id: 'abu-66'")
const block = s.slice(start, end)
const nb = block.replace(
  /lyricsIgbo: `[\s\S]*?`,/,
  `lyricsIgbo: \`Verse 1
Kuyem ume, Chuku:
Mejuem na ndu ọhụ,
Ka m'we hu ihe-Gi n'anya,
Neme kwa uche-Gi.\`,`
)
fs.writeFileSync(p, s.slice(0, start) + nb + s.slice(end))
