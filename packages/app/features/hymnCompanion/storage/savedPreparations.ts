import AsyncStorage from '@react-native-async-storage/async-storage'
import type { SavedPreparation } from '../types'

const STORAGE_KEY = 'hymn_companion_preparations_v1'

export async function loadPreparations(): Promise<SavedPreparation[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as SavedPreparation[]
  } catch {
    return []
  }
}

export async function savePreparation(entry: SavedPreparation): Promise<void> {
  const existing = await loadPreparations()
  const next = [entry, ...existing.filter((p) => p.id !== entry.id)]
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export async function deletePreparation(id: string): Promise<void> {
  const existing = await loadPreparations()
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((p) => p.id !== id)))
}
