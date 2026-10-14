import type { ReadingSlot } from './types'

/** Wed, Fri, Sun — BSG is the required fellowship reading. */
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
  return 'bsg'
}

export function slotLabel(slot: ReadingSlot): string {
  switch (slot) {
    case 'bsg':
      return 'BSG (Daily reading)'
    case 'mp':
      return 'Morning Prayer (MP)'
    case 'ep':
      return 'Evening Prayer (EP)'
  }
}
