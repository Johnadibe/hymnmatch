import { describe, expect, it } from 'vitest'
import { getHymnById } from '../hymnCatalog'
import { parseHymnSearchQuery, searchHymnCatalog } from '../hymnSearch'

describe('parseHymnSearchQuery', () => {
  it('detects plain numbers', () => {
    expect(parseHymnSearchQuery('59')).toEqual({ mode: 'number', digits: '59', value: 59 })
  })

  it('detects abu prefix', () => {
    expect(parseHymnSearchQuery('Abu 128')).toEqual({ mode: 'number', digits: '128', value: 128 })
  })
})

describe('searchHymnCatalog', () => {
  it('returns full catalogue when query is empty', () => {
    expect(searchHymnCatalog('').length).toBeGreaterThan(100)
  })

  it('finds exact Abu by number without matching every hymn containing digit 1', () => {
    const results = searchHymnCatalog('1')
    expect(results[0]?.number).toBe(1)
    expect(results.some((h) => h.number === 1)).toBe(true)
    expect(results.every((h) => String(h.number).startsWith('1'))).toBe(true)
  })

  it('finds Abu 59 only when typing 59', () => {
    const results = searchHymnCatalog('59')
    expect(results).toHaveLength(1)
    expect(results[0]?.number).toBe(59)
  })

  it('matches English title words', () => {
    const results = searchHymnCatalog('shepherd')
    expect(results.some((h) => h.number === 115)).toBe(true)
  })

  it('matches Igbo lyrics without diacritics', () => {
    const holy = getHymnById('abu-1')
    expect(holy).toBeDefined()
    const results = searchHymnCatalog('chuku okike')
    expect(results.some((h) => h.number === 1)).toBe(true)
  })

  it('matches Igbo phrase inside a verse', () => {
    const results = searchHymnCatalog('kuyem ume')
    expect(results.some((h) => h.number === 65)).toBe(true)
  })
})
