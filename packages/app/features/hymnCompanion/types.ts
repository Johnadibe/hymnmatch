export type HymnCollection = 'acppb_abu'

export type HymnCatalogEntry = {
  id: string
  /** Abu number in the Igbo hymnbook (1–400). */
  number: number
  /** Igbo title as printed in the hymnbook. */
  title: string
  /** English equivalent subtitle from the Abu book — primary key for hymn matching. */
  titleEnglish: string
  collection: HymnCollection
  collectionLabel: string
  language: 'ig'
  /** English theme tags used for fallback matching and display. */
  themes: string[]
  scriptureRefs: string[]
  occasion: string[]
  /** First line in Igbo. */
  firstLine?: string
  /** Full Igbo lyrics (verses) from fellowship uploads. */
  lyricsIgbo?: string
  /** Typical A&M / SS&S cross-reference; edition numbers may vary. */
  englishHymnalRefs?: string
  /** English synopsis sent to the suggestion service (not shown as primary UI). */
  matchProfile: string
  /** Fellowship has confirmed Igbo text and English mapping. */
  verified: boolean
}

export type ScriptureVerse = {
  chapter: number
  verse: number
  text: string
}

export type DailyReading = {
  date: string
  reference: string
  title: string
  sourceLabel: string
  passages: string[]
  text: string
  /** Verse-by-verse lines for display; `text` remains the full string for hymn matching. */
  verses?: ScriptureVerse[]
  translationName?: string
  /** How passage text was loaded (WEB, cached on device). */
  textDelivery?: 'network' | 'cache' | 'cache-offline'
  fellowship?: {
    marketDay: string
    dayLabel: string
    slot: 'bsg' | 'mp' | 'ep'
    bsg: string
    mp: string[]
    ep: string[]
  }
}

export type HymnRecommendation = {
  hymnId: string
  fitStrength: 'strong' | 'good' | 'moderate'
  reason: string
  matchedThemes: string[]
}

export type MatchResult = {
  sermonThemes: string[]
  recommendations: HymnRecommendation[]
}

export type SavedPreparation = {
  id: string
  date: string
  reference: string
  sermonTheme: string
  notes: string
  selectedHymnIds: string[]
  createdAt: string
}
