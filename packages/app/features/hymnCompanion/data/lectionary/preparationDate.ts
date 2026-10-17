import {
  formatDateKey,
  getFellowshipDay,
  getLectionaryDateRange,
  listAllLectionaryDays,
} from './fellowshipLectionary'

export function startOfLocalDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function parseDateKey(key: string): Date {
  const [y, m, day] = key.split('-').map(Number)
  return startOfLocalDay(new Date(y!, m! - 1, day))
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return formatDateKey(a) === formatDateKey(b)
}

export function addCalendarDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return startOfLocalDay(d)
}

export function getLectionaryBounds(): { min: Date; max: Date } | null {
  const range = getLectionaryDateRange()
  if (!range) return null
  return { min: parseDateKey(range.start), max: parseDateKey(range.end) }
}

/** Best date to open Readings: today if in lectionary, else nearest scheduled day. */
export function getDefaultPreparationDate(): Date {
  const today = startOfLocalDay(new Date())
  if (getFellowshipDay(today)) return today

  const days = listAllLectionaryDays()
  if (days.length === 0) return clampToLectionaryRange(today)

  const todayKey = formatDateKey(today)
  const upcoming = days.find((d) => d.date >= todayKey)
  if (upcoming) return parseDateKey(upcoming.date)

  return parseDateKey(days[days.length - 1]!.date)
}

export function clampToLectionaryRange(date: Date): Date {
  const bounds = getLectionaryBounds()
  const d = startOfLocalDay(date)
  if (!bounds) return d
  if (d.getTime() < bounds.min.getTime()) return bounds.min
  if (d.getTime() > bounds.max.getTime()) return bounds.max
  return d
}

/** Next occurrence of weekday (0 Sun … 6 Sat) on or after `from`. */
export function upcomingWeekday(from: Date, weekday: number): Date {
  const d = startOfLocalDay(from)
  let diff = weekday - d.getDay()
  if (diff < 0) diff += 7
  return clampToLectionaryRange(addCalendarDays(d, diff))
}

/** ACPPB Daily Bread weekday labels (fixed, not locale-dependent). */
const WEEKDAY_GUIDE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'] as const

export function formatWeekdayGuide(date: Date): string {
  return WEEKDAY_GUIDE[date.getDay()] ?? 'Sun'
}

export function formatPreparationHeading(date: Date): string {
  const rest = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${formatWeekdayGuide(date)}, ${rest}`
}

export function formatPreparationShort(date: Date): string {
  const rest = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  return `${formatWeekdayGuide(date)}, ${rest}`
}
