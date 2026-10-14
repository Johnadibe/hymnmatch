export type HymnCollection = 'ancient_modern' | 'songs_of_praise'

export type HymnCatalogEntry = {
  id: string
  number: number
  title: string
  collection: HymnCollection
  collectionLabel: string
  language: 'en'
  themes: string[]
  scriptureRefs: string[]
  occasion: string[]
  firstLine?: string
  verified: boolean
}

export type DailyReading = {
  date: string
  reference: string
  title: string
  sourceLabel: string
  passages: string[]
  text: string
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
