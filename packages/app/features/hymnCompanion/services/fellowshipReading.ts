import type { DailyReading } from '../types'
import {
  formatDateKey,
  getFellowshipDay,
  getLectionaryDateRange,
  resolveFellowshipReading,
  type ReadingSelection,
} from '../data/lectionary/fellowshipLectionary'
import { formatWeekdayGuide } from '../data/lectionary/preparationDate'
import { fetchPassageText, type FetchPassageOptions } from './fetchPassage'

export async function fetchFellowshipDailyReading(
  date = new Date(),
  selection?: ReadingSelection,
  passageOptions?: FetchPassageOptions
): Promise<DailyReading> {
  const day = getFellowshipDay(date)
  if (!day) {
    const range = getLectionaryDateRange()
    const hint = range
      ? `Readings are available ${range.start} through ${range.end}.`
      : 'No lectionary loaded.'
    throw new Error(`No fellowship reading for this date. ${hint}`)
  }

  const chosen = resolveFellowshipReading(day, date, selection)
  const scripture = await fetchPassageText(chosen.reference, passageOptions)

  return {
    date: formatDateKey(date),
    reference: scripture.reference,
    title: `${day.marketDay} · ${formatWeekdayGuide(date)}`,
    sourceLabel: 'ACPPB Daily Bread Guide',
    passages: [chosen.reference],
    text: scripture.text,
    verses: scripture.verses,
    translationName: scripture.translationName,
    textDelivery: scripture.delivery,
    fellowship: {
      marketDay: day.marketDay,
      dayLabel: formatWeekdayGuide(date),
      slot: chosen.slot,
      bsg: day.bsg,
      mp: day.mp,
      ep: day.ep,
    },
  }
}
