export type IgboMarketDay = 'Afor' | 'Nkwo' | 'Eke' | 'Orie'

export type FellowshipLectionaryDay = {
  /** YYYY-MM-DD */
  date: string
  dayLabel: string
  marketDay: IgboMarketDay
  bsg: string
  mp: string[]
  ep: string[]
}

export type ReadingSlot = 'bsg' | 'mp' | 'ep'

export type SelectedFellowshipReading = {
  slot: ReadingSlot
  reference: string
  label: string
  marketDay: IgboMarketDay
  dayLabel: string
}
