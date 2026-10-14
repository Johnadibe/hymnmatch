/** Normalize fellowship booklet abbreviations for passage text lookup. */
export function normalizeBibleReference(raw: string): string {
  let ref = raw.trim().replace(/\s+/g, ' ')
  ref = ref.replace(/(\d)\.(\d)/g, '$1:$2')
  ref = ref.replace(/-(\d)/g, '-$1')

  const bookPatterns: Array<[RegExp, string]> = [
    [/^1\s*Thess\.?\s*/i, '1 Thessalonians '],
    [/^2\s*Thess\.?\s*/i, '2 Thessalonians '],
    [/^1\s*Tim\.?\s*/i, '1 Timothy '],
    [/^2\s*Tim\.?\s*/i, '2 Timothy '],
    [/^1\s*Kgs\.?\s*/i, '1 Kings '],
    [/^2\s*Kgs\.?\s*/i, '2 Kings '],
    [/^2\s*Chron?\.?\s*/i, '2 Chronicles '],
    [/^2\s*Chro\.?\s*/i, '2 Chronicles '],
    [/^1\s*Chron?\.?\s*/i, '1 Chronicles '],
    [/^1\s*Cor\.?\s*/i, '1 Corinthians '],
    [/^2\s*Cor\.?\s*/i, '2 Corinthians '],
    [/^1\s*Pet\.?\s*/i, '1 Peter '],
    [/^2\s*Pet\.?\s*/i, '2 Peter '],
    [/^1\s*Jn\.?\s*/i, '1 John '],
    [/^2\s*Jn\.?\s*/i, '2 John '],
    [/^3\s*Jn\.?\s*/i, '3 John '],
    [/^1\s*Sam\.?\s*/i, '1 Samuel '],
    [/^2\s*Sam\.?\s*/i, '2 Samuel '],
    [/^Mt\.?\s*/i, 'Matthew '],
    [/^Matt\.?\s*/i, 'Matthew '],
    [/^Mk\.?\s*/i, 'Mark '],
    [/^Lk\.?\s*/i, 'Luke '],
    [/^Jn\.?\s*/i, 'John '],
    [/^Rev\.?\s*/i, 'Revelation '],
    [/^Mal\.?\s*/i, 'Malachi '],
    [/^Mic\.?\s*/i, 'Micah '],
    [/^Ps\.?\s*/i, 'Psalm '],
    [/^Psalm\s*/i, 'Psalm '],
    [/^Prov\.?\s*/i, 'Proverbs '],
    [/^Exod?\.?\s*/i, 'Exodus '],
    [/^Eccles\.?\s*/i, 'Ecclesiastes '],
    [/^Col\.?\s*/i, 'Colossians '],
    [/^Phil\.?\s*/i, 'Philippians '],
    [/^Gal\.?\s*/i, 'Galatians '],
    [/^Rom\.?\s*/i, 'Romans '],
    [/^Jas\.?\s*/i, 'James '],
    [/^Heb\.?\s*/i, 'Hebrews '],
    [/^Hab\.?\s*/i, 'Habakkuk '],
    [/^Zeph\.?\s*/i, 'Zephaniah '],
    [/^Nah\.?\s*/i, 'Nahum '],
    [/^Obad\.?\s*/i, 'Obadiah '],
    [/^Hos\.?\s*/i, 'Hosea '],
    [/^Isa\.?\s*/i, 'Isaiah '],
    [/^Jer\.?\s*/i, 'Jeremiah '],
    [/^Ezek\.?\s*/i, 'Ezekiel '],
    [/^Dan\.?\s*/i, 'Daniel '],
    [/^Gen\.?\s*/i, 'Genesis '],
    [/^Deut\.?\s*/i, 'Deuteronomy '],
    [/^Num\.?\s*/i, 'Numbers '],
    [/^Lev\.?\s*/i, 'Leviticus '],
    [/^Josh\.?\s*/i, 'Joshua '],
    [/^Acts\.?\s*/i, 'Acts '],
    [/^Songs\.?\s*/i, 'Song of Solomon '],
    [/^Jude\.?\s*/i, 'Jude '],
    [/^Job\.?\s*/i, 'Job '],
    [/^Titus\.?\s*/i, 'Titus '],
  ]

  for (const [pattern, book] of bookPatterns) {
    if (pattern.test(ref)) {
      ref = ref.replace(pattern, book)
      break
    }
  }

  return ref.trim()
}

export function splitReadingList(field: string): string[] {
  return field
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}
