/** Map Igbo letters to ASCII so typing without dots/accents still matches catalogue text. */
function foldIgboLetters(text: string): string {
  return text
    .replace(/[ọöôòóō]/gi, 'o')
    .replace(/[ụùúū]/gi, 'u')
    .replace(/[ẹèéē]/gi, 'e')
    .replace(/[ịìíī]/gi, 'i')
    .replace(/[áàâãā]/gi, 'a')
    .replace(/[ṅń]/gi, 'n')
    .replace(/[ṣś]/gi, 's')
    .replace(/[ḿm̀]/gi, 'm')
}

/** Fold Igbo diacritics and punctuation so typing without accents still matches. */
export function normalizeSearchText(raw: string): string {
  return foldIgboLetters(
    raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[''`´]/g, '')
      .replace(/[—–-]/g, ' ')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}
