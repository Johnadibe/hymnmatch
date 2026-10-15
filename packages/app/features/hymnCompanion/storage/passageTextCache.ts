import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ScriptureVerse } from '../types'

const CACHE_KEY = 'hymn_companion_passage_text_web_v2'
const MAX_ENTRIES = 400

export type CachedPassageRecord = {
  text: string
  translationName: string
  reference: string
  fetchedAt: string
  verses?: ScriptureVerse[]
}

type CacheStore = Record<string, CachedPassageRecord>

async function readStore(): Promise<CacheStore> {
  const raw = await AsyncStorage.getItem(CACHE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as CacheStore
  } catch {
    return {}
  }
}

async function writeStore(store: CacheStore): Promise<void> {
  const keys = Object.keys(store)
  if (keys.length <= MAX_ENTRIES) {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(store))
    return
  }
  const sorted = keys.sort(
    (a, b) => store[a]!.fetchedAt.localeCompare(store[b]!.fetchedAt)
  )
  const trimmed: CacheStore = {}
  for (const key of sorted.slice(-MAX_ENTRIES)) {
    trimmed[key] = store[key]!
  }
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(trimmed))
}

export async function getCachedPassage(cacheKey: string): Promise<CachedPassageRecord | null> {
  const store = await readStore()
  return store[cacheKey] ?? null
}

export async function setCachedPassage(
  cacheKey: string,
  record: Omit<CachedPassageRecord, 'fetchedAt'> & { fetchedAt?: string }
): Promise<void> {
  const store = await readStore()
  store[cacheKey] = {
    ...record,
    fetchedAt: record.fetchedAt ?? new Date().toISOString(),
  }
  await writeStore(store)
}
