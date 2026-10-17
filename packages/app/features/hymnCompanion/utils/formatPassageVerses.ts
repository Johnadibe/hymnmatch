import type { ScriptureVerse } from '../types'

type ApiVerse = {
  book_name: string
  chapter: number
  verse: number
  text: string
}

export function versesFromApi(apiVerses: ApiVerse[] | undefined): ScriptureVerse[] {
  if (!apiVerses?.length) return []
  return apiVerses.map((v) => ({
    chapter: v.chapter,
    verse: v.verse,
    text: v.text.trim().replace(/\s+/g, ' '),
  }))
}

function verseLabel(chapter: number, verse: number, multiChapter: boolean): string {
  return multiChapter ? `${chapter}:${verse}` : String(verse)
}

/** Plain text with verse numbers — used for AI matching and search. */
export function passageTextFromVerses(verses: ScriptureVerse[]): string {
  if (verses.length === 0) return ''
  const chapters = new Set(verses.map((v) => v.chapter))
  const multiChapter = chapters.size > 1
  return verses.map((v) => `${verseLabel(v.chapter, v.verse, multiChapter)} ${v.text}`).join('\n\n')
}

export function formatPassageFromApi(
  apiVerses: ApiVerse[] | undefined,
  fallbackText: string
): {
  text: string
  verses: ScriptureVerse[]
} {
  const verses = versesFromApi(apiVerses)
  if (verses.length === 0) {
    return { text: fallbackText.trim(), verses: [] }
  }
  return { text: passageTextFromVerses(verses), verses }
}
