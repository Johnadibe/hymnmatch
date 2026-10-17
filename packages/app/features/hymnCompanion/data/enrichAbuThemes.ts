import type { HymnCatalogEntry } from '../types'

const push = (set: Set<string>, ...tags: string[]) => {
  for (const tag of tags) set.add(tag)
}

/** Ensure Abu entries have 2–4 English theme tags for matching (avoid single-tag stubs). */
export function enrichAbuThemes(entry: HymnCatalogEntry): HymnCatalogEntry {
  if (entry.collection !== 'acppb_abu') return entry

  const tags = new Set(entry.themes)
  const section = (entry.bookSection ?? '').toUpperCase()
  const occasion = entry.occasion ?? []

  if (section.includes('ATỌ') || section.includes('ATỌ NIM')) {
    push(tags, 'Trinity', 'worship', 'praise', 'holiness')
  }
  if (section.includes('CHINEKE NNA') || section.includes('NNA')) {
    push(tags, 'God the Father', 'worship', 'praise')
  }
  if (section.includes('OKPARA') || (section.includes('JISUS') && section.includes('CHINEKE'))) {
    push(tags, 'Jesus', 'God the Son', 'worship')
  }
  if (section.includes('OMỤMỤ') || section.includes('OMUMU')) {
    push(tags, 'Nativity', 'Jesus', 'praise', 'worship')
  }
  if (section.includes('ỌNWỤ') || section.includes('NBILITE')) {
    push(tags, 'Jesus', 'Easter', 'cross', 'praise')
  }
  if (section.includes('OBIBIA') || section.includes('ADVENT')) {
    push(tags, 'Advent', 'Jesus', 'hope', 'worship')
  }
  if (section.includes('MỌ NSỌ') || section.includes('MO NSO')) {
    push(tags, 'Holy Spirit', 'sanctification', 'prayer', 'praise')
  }
  if (section.includes('AKWUKWO') || section.includes('SCRIPTURE')) {
    push(tags, 'Scripture', 'Word of God', 'guidance', 'worship')
  }
  if (section.includes('NZUKO') || section.includes('CHURCH')) {
    push(tags, 'worship', 'discipleship', 'mission')
  }
  if (section.includes('UBOCHI') || section.includes('LORD')) {
    push(tags, "Lord's Day", 'worship', 'praise')
  }
  if (section.includes('ORIRI') || section.includes('COMMUNION')) {
    push(tags, 'communion', 'Jesus', 'worship', 'salvation')
  }
  if (section.includes('IDO NDI-OZI') || section.includes('ORDINATION')) {
    push(tags, 'ordination', 'consecration', 'service', 'discipleship')
  }
  if (section.includes('IJIK') || section.includes('NWUNYE')) {
    push(tags, 'marriage', 'worship', 'discipleship')
  }
  if (section.includes('ILỊ OZU') || section.includes('ILI OZU')) {
    push(tags, 'funeral', 'comfort', 'hope', 'heaven')
  }
  if (section.includes('ELU-IGWE') || section.includes('ELU IGWE')) {
    push(tags, 'heaven', 'hope', 'worship', 'praise')
  }
  if (section.includes('OTUTO')) {
    push(tags, 'praise', 'thanksgiving', 'worship')
  }
  if (section.includes('NCHÈGHARI') || section.includes('NCHEGHARI')) {
    push(tags, 'repentance', 'confession', 'forgiveness', 'prayer')
  }
  if (section.includes('OKWUKWE')) {
    push(tags, 'faith', 'trust', 'assurance', 'worship')
  }
  if (section.includes("ITỌ N'AMARA") || section.includes('ITO N')) {
    push(tags, 'grace', 'praise', 'thanksgiving', 'worship')
  }
  if (section.includes('ISO KRAIST')) {
    push(tags, 'discipleship', 'cross', 'Jesus', 'service')
  }
  if (section.includes('ILUSO NMEHIE')) {
    push(tags, 'temptation', 'sin', 'warfare', 'prayer')
  }
  if (section.includes('IGBARA KRAIST')) {
    push(tags, 'Jesus', 'Lamb', 'worship', 'praise')
  }
  if (section.includes('IJERE KRAIST')) {
    push(tags, 'mission', 'Jesus', 'discipleship', 'service')
  }
  if (section.includes('EKPERE')) {
    push(tags, 'prayer', 'worship', 'faith')
  }
  if (section.includes('OZI ỌMA') || section.includes('OZI OMA')) {
    push(tags, 'Gospel', 'mission', 'praise', 'worship')
  }
  if (section.includes('UMU-NTAKIRI') || section.includes('UMU NTAKIRI')) {
    push(tags, 'children', 'worship', 'prayer')
  }
  if (section.includes('UTUTU')) {
    push(tags, 'morning', 'worship', 'praise', "Lord's Day")
  }
  if (section.includes('ANYASI')) {
    push(tags, 'evening', 'worship', 'prayer', 'praise')
  }
  if (section.includes('ONYINYE')) {
    push(tags, 'offertory', 'dedication', 'worship', 'praise')
  }
  if (section.includes('ARỌ ỌHU') || section.includes('ARO OHU')) {
    push(tags, 'New Year', 'worship', 'praise', 'thanksgiving')
  }
  if (section.includes('NDI-ỌRIA') || section.includes('NDI ORIA')) {
    push(tags, 'healing', 'comfort', 'prayer', 'faith')
  }
  if (section.includes('NDI-IJE') || section.includes('NDI IJE')) {
    push(tags, 'travel', 'protection', 'prayer', 'faith')
  }
  if (section.includes('IDO ULO')) {
    push(tags, 'dedication', 'worship', 'church', 'praise')
  }
  if (section.includes('KỌRỌS') || section.includes('KOROS')) {
    push(tags, 'chorus', 'praise', 'worship')
  }
  if (section.includes('CHEPUTARA') || section.includes('NDI-IGBO CHEPUTARA')) {
    push(tags, 'worship', 'praise', 'Igbo hymnody')
  }
  if (section.includes("WOMEN'S GUILD") || section.includes('WOMENS GUILD')) {
    push(tags, 'women', 'service', 'prayer', 'worship')
  }
  if (section.includes('MMIRI') || section.includes('BAPTISM')) {
    push(tags, 'baptism', 'discipleship', 'worship')
  }

  for (const o of occasion) {
    const key = o.toLowerCase()
    if (key.includes('christmas')) push(tags, 'Nativity', 'Jesus', 'praise')
    if (key.includes('easter')) push(tags, 'Easter', 'Jesus', 'praise')
    if (key.includes('pentecost')) push(tags, 'Holy Spirit', 'praise', 'worship')
    if (key.includes('communion')) push(tags, 'communion', 'Jesus', 'worship')
    if (key.includes('ordination')) push(tags, 'ordination', 'consecration', 'service')
    if (key.includes('praise')) push(tags, 'praise', 'worship')
    if (key.includes('opening')) push(tags, 'worship', 'praise')
  }

  if (tags.size < 2) {
    push(tags, 'worship', 'praise')
  }

  const ordered = [...tags]
  const primary = entry.themes[0]
  const rest = ordered.filter((t) => t !== primary).sort()
  const themes = [primary, ...rest].slice(0, 4)

  if (themes.length === entry.themes.length && themes.every((t, i) => t === entry.themes[i])) {
    return entry
  }

  return { ...entry, themes }
}

export function enrichAbuCatalog(entries: HymnCatalogEntry[]): HymnCatalogEntry[] {
  return entries.map(enrichAbuThemes)
}
