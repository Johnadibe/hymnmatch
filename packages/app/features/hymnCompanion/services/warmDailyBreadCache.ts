import lectionary from '../data/lectionary/lectionary2026.json'
import { resolveGuideReferenceForFetch } from '../data/lectionary/normalizeReference'
import { fetchPassageText } from './fetchPassage'

const WARM_KEY = 'daily_bread_cache_warmed_v1'

/** Background-download passage text for every Daily Bread Guide line (once per install). */
export async function warmDailyBreadPassageCache(): Promise<void> {
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage')
  const done = await AsyncStorage.getItem(WARM_KEY)
  if (done === '1') return

  const rawRefs = new Set<string>()
  for (const day of lectionary as Array<{ bsg: string; mp: string[]; ep: string[] }>) {
    rawRefs.add(day.bsg)
    for (const r of day.mp) rawRefs.add(r)
    for (const r of day.ep) rawRefs.add(r)
  }

  for (const raw of rawRefs) {
    try {
      const ref = resolveGuideReferenceForFetch(raw)
      await fetchPassageText(ref)
    } catch {
      /* skip unreachable refs while offline */
    }
    await new Promise((r) => setTimeout(r, 120))
  }

  await AsyncStorage.setItem(WARM_KEY, '1')
}

export function scheduleDailyBreadCacheWarm(): void {
  void warmDailyBreadPassageCache()
}
