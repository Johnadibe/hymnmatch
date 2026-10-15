/** Fold Igbo diacritics and punctuation so typing without accents still matches. */
export function normalizeSearchText(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[''`´]/g, '')
    .replace(/[—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
