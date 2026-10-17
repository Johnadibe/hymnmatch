import catalogJson from './songsOfPraise/songsOfPraiseCatalog.json'
import type { SongOfPraiseEntry } from '../types'

export const songsOfPraiseCatalog = catalogJson as SongOfPraiseEntry[]

const byNumber = new Map(songsOfPraiseCatalog.map((s) => [s.number, s]))

export function getSongOfPraiseByNumber(number: number): SongOfPraiseEntry | undefined {
  return byNumber.get(number)
}

export const SONGS_OF_PRAISE_COUNT = songsOfPraiseCatalog.length
