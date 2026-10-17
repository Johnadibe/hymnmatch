/** Normalize punctuation in user-visible strings (no em/en dashes). */
export function plainAppCopy(text: string): string {
  return text
    .replace(/\u2026/g, '...')
    .replace(/\s*[\u2014\u2013]\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s+\./g, '.')
    .trim()
}
