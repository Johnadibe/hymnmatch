import type { ReadingSlot } from './types'

/** Wed, Fri, Sun — daily column is the required Daily Bread reading. */
export function isBsgRequiredDay(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 3 || day === 5
}

/** Mon, Tue, Thu, Sat — preacher may use MP or EP instead of BSG in the morning/evening. */
export function isMpEpChoiceDay(date: Date): boolean {
  const day = date.getDay()
  return day === 1 || day === 2 || day === 4 || day === 6
}

export function defaultSlotForDate(date: Date): ReadingSlot {
  if (isMpEpChoiceDay(date)) return 'mp'
  return 'bsg'
}

export function slotLabel(slot: ReadingSlot): string {
  switch (slot) {
    case 'bsg':
      return 'Daily Bread'
    case 'mp':
      return 'Morning Prayer'
    case 'ep':
      return 'Evening Prayer'
  }
}
