import AsyncStorage from '@react-native-async-storage/async-storage'
import type { DailyReading } from '../types'

const SESSION_KEY = 'hymn_companion_active_reading_v1'

export async function setActiveReading(reading: DailyReading): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(reading))
}

export async function getActiveReading(): Promise<DailyReading | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as DailyReading
  } catch {
    return null
  }
}

export type MatchSession = {
  reading: DailyReading
  themeHint: string
  sermonThemes?: string[]
}

const MATCH_KEY = 'hymn_companion_match_session_v1'

export async function setMatchSession(session: MatchSession): Promise<void> {
  await AsyncStorage.setItem(MATCH_KEY, JSON.stringify(session))
}

export async function getMatchSession(): Promise<MatchSession | null> {
  const raw = await AsyncStorage.getItem(MATCH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as MatchSession
  } catch {
    return null
  }
}
