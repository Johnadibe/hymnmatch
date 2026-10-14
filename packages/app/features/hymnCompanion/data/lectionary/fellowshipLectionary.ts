import lectionary from './lectionary2026.json'
import { normalizeBibleReference } from './normalizeReference'
import { defaultSlotForDate, slotLabel } from './readingRules'
import type {
  FellowshipLectionaryDay,
  IgboMarketDay,
  ReadingSlot,
  SelectedFellowshipReading,
} from './types'

const days = lectionary as FellowshipLectionaryDay[]
const byDate = new Map(days.map((d) => [d.date, d]))

export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getFellowshipDay(date: Date): FellowshipLectionaryDay | undefined {
  return byDate.get(formatDateKey(date))
}

export function getLectionaryDateRange(): { start: string; end: string } | null {
  if (days.length === 0) return null
  const sorted = listAllLectionaryDays()
  return { start: sorted[0]!.date, end: sorted[sorted.length - 1]!.date }
}

export function listAllLectionaryDays(): FellowshipLectionaryDay[] {
  return [...days].sort((a, b) => a.date.localeCompare(b.date))
}

export type ReadingSelection = {
  slot: ReadingSlot
  /** Index within mp or ep array when slot is mp/ep */
  index?: number
}

export function resolveFellowshipReading(
  day: FellowshipLectionaryDay,
  date: Date,
  selection?: ReadingSelection
): SelectedFellowshipReading {
  const slot = selection?.slot ?? defaultSlotForDate(date)
  const index = selection?.index ?? 0

  let rawRef = day.bsg
  if (slot === 'mp') {
    rawRef = day.mp[index] ?? day.mp[0] ?? day.bsg
  } else if (slot === 'ep') {
    rawRef = day.ep[index] ?? day.ep[0] ?? day.bsg
  }

  const reference = normalizeBibleReference(rawRef)
  const label = slotLabel(slot)

  return {
    slot,
    reference,
    label,
    marketDay: day.marketDay as IgboMarketDay,
    dayLabel: day.dayLabel,
  }
}

export function listSelectableReferences(
  day: FellowshipLectionaryDay,
  slot: ReadingSlot
): Array<{ index: number; reference: string; display: string }> {
  const list = slot === 'bsg' ? [day.bsg] : slot === 'mp' ? day.mp : day.ep
  return list.map((raw, index) => ({
    index,
    reference: normalizeBibleReference(raw),
    display: raw,
  }))
}
