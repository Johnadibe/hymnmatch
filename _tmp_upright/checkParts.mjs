import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
let all = ''
for (let i = 1; i <= 11; i++) {
  all += fs.readFileSync(path.join(dir, `part${String(i).padStart(2, '0')}.md`), 'utf8')
}
const hymns = []
const re = /```yaml\n([\s\S]*?)```/g
let m
while ((m = re.exec(all))) {
  const b = m[1]
  const n = +b.match(/^number: (\d+)/m)[1]
  const sec = b.match(/^bookSection: "([^"]+)"/m)?.[1]
  const page = +b.match(/^bookPage: (\d+)/m)?.[1]
  hymns.push({ n, sec, page })
}
hymns.sort((a, b) => a.n - b.n)
for (let n = 301; n <= 400; n++) {
  if (!hymns.find((h) => h.n === n)) 
}
let cur = null
for (const h of hymns) {
  if (!cur || cur.sec !== h.sec) {
    if (cur) 
    cur = { sec: h.sec, start: h.n, end: h.n }
  } else cur.end = h.n
}
if (cur) 
