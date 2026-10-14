import { formatDateKey, getLectionaryDateRange } from './fellowshipLectionary'

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

export function formatPreparationHeading(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatPreparationShort(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
