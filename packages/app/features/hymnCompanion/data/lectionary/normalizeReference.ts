function escapeRegex(fragment: string): string {
  return fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Expand fellowship booklet abbrev (Rom. 12) without touching full book names (Romans 12).
 */
function tryExpandBookPrefix(ref: string, abbrev: string, fullName: string): string {
  if (ref.toLowerCase().startsWith(fullName.toLowerCase())) {
    return ref
  }
  const esc = escapeRegex(abbrev)
  const dotted = new RegExp(`^${esc}\\.\\s*`, 'i')
  if (dotted.test(ref)) {
    return ref.replace(dotted, `${fullName} `)
  }
  const spaced = new RegExp(`^${esc}\\s+(?=\\d)`, 'i')
  if (spaced.test(ref)) {
    return ref.replace(spaced, `${fullName} `)
  }
  return ref
}

function applyDottedAbbrev(ref: string, pattern: RegExp, fullName: string): string {
  if (pattern.test(ref)) {
    return ref.replace(pattern, `${fullName} `)
  }
  return ref
}

/** Normalize fellowship booklet abbreviations for passage text lookup. */
export function normalizeBibleReference(raw: string): string {
  let ref = raw.trim().replace(/\s+/g, ' ')
  ref = ref.replace(/\u2013|\u2014|\u2012/g, '-')
  ref = ref.replace(/(\d)\.(\d)/g, '$1:$2')

  ref = applyDottedAbbrev(ref, /^1\s*Thess\.\s*/i, '1 Thessalonians')
  ref = applyDottedAbbrev(ref, /^2\s*Thess\.\s*/i, '2 Thessalonians')
  ref = applyDottedAbbrev(ref, /^1\s*Tim\.\s*/i, '1 Timothy')
  ref = applyDottedAbbrev(ref, /^2\s*Tim\.\s*/i, '2 Timothy')
  ref = applyDottedAbbrev(ref, /^1\s*Kgs\.\s*/i, '1 Kings')
  ref = applyDottedAbbrev(ref, /^2\s*Kgs\.\s*/i, '2 Kings')
  ref = applyDottedAbbrev(ref, /^2\s*Chron?\.\s*/i, '2 Chronicles')
  ref = applyDottedAbbrev(ref, /^2\s*Chro\.\s*/i, '2 Chronicles')
  ref = applyDottedAbbrev(ref, /^1\s*Chron?\.\s*/i, '1 Chronicles')
  ref = applyDottedAbbrev(ref, /^1\s*Cor\.\s*/i, '1 Corinthians')
  ref = applyDottedAbbrev(ref, /^2\s*Cor\.\s*/i, '2 Corinthians')
  ref = applyDottedAbbrev(ref, /^1\s*Pet\.\s*/i, '1 Peter')
  ref = applyDottedAbbrev(ref, /^2\s*Pet\.\s*/i, '2 Peter')
  ref = applyDottedAbbrev(ref, /^1\s*Jn\.\s*/i, '1 John')
  ref = applyDottedAbbrev(ref, /^2\s*Jn\.\s*/i, '2 John')
  ref = applyDottedAbbrev(ref, /^3\s*Jn\.\s*/i, '3 John')
  ref = applyDottedAbbrev(ref, /^1\s*Sam\.\s*/i, '1 Samuel')
  ref = applyDottedAbbrev(ref, /^2\s*Sam\.\s*/i, '2 Samuel')

  const singles: Array<[string, string]> = [
    ['Mt', 'Matthew'],
    ['Matt', 'Matthew'],
    ['Mk', 'Mark'],
    ['Lk', 'Luke'],
    ['Jn', 'John'],
    ['Rev', 'Revelation'],
    ['Mal', 'Malachi'],
    ['Mic', 'Micah'],
    ['Ps', 'Psalm'],
    ['Prov', 'Proverbs'],
    ['Exod', 'Exodus'],
    ['Exo', 'Exodus'],
    ['Eccles', 'Ecclesiastes'],
    ['Col', 'Colossians'],
    ['Phil', 'Philippians'],
    ['Gal', 'Galatians'],
    ['Rom', 'Romans'],
    ['Jas', 'James'],
    ['Heb', 'Hebrews'],
    ['Hab', 'Habakkuk'],
    ['Zeph', 'Zephaniah'],
    ['Nah', 'Nahum'],
    ['Obad', 'Obadiah'],
    ['Hos', 'Hosea'],
    ['Isa', 'Isaiah'],
    ['Jer', 'Jeremiah'],
    ['Ezek', 'Ezekiel'],
    ['Dan', 'Daniel'],
    ['Gen', 'Genesis'],
    ['Deut', 'Deuteronomy'],
    ['Num', 'Numbers'],
    ['Lev', 'Leviticus'],
    ['Josh', 'Joshua'],
    ['Acts', 'Acts'],
    ['Songs', 'Song of Solomon'],
    ['Jude', 'Jude'],
    ['Job', 'Job'],
    ['Titus', 'Titus'],
  ]

  for (const [abbrev, full] of singles) {
    ref = tryExpandBookPrefix(ref, abbrev, full)
  }

  if (/^Psalm\s+/i.test(ref)) {
    ref = ref.replace(/^Psalm\s+/i, 'Psalm ')
  }

  return ref.trim()
}

export function splitReadingList(field: string): string[] {
  return field
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}
