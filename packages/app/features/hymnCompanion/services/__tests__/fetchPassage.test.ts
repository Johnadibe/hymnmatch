import { describe, expect, it } from 'vitest'
import { bibleApiPathForReference } from '../fetchPassage'
import {
  normalizeBibleReference,
  resolveGuideReferenceForFetch,
} from '../../data/lectionary/normalizeReference'

describe('bibleApiPathForReference', () => {
  it('uses plus for spaces without over-encoding', () => {
    expect(bibleApiPathForReference('Romans 12:1-2')).toBe('Romans+12:1-2')
  })
})

describe('normalizeBibleReference', () => {
  it('fixes fellowship verse ranges with a dot before verse', () => {
    expect(normalizeBibleReference('2 Kings 23:21-24.7')).toBe('2 Kings 23:21-24:7')
  })

  it('normalizes en-dash verse ranges', () => {
    expect(normalizeBibleReference('Romans 12:1–2')).toBe('Romans 12:1-2')
  })

  it('does not mangle full book names typed in override', () => {
    expect(normalizeBibleReference('Romans 12:1-2')).toBe('Romans 12:1-2')
    expect(normalizeBibleReference('John 3:16')).toBe('John 3:16')
    expect(normalizeBibleReference('Revelation 21:1-8')).toBe('Revelation 21:1-8')
  })

  it('still expands fellowship-style abbreviations', () => {
    expect(normalizeBibleReference('Rom. 12:1-2')).toBe('Romans 12:1-2')
    expect(normalizeBibleReference('Rev. 21:1-8')).toBe('Revelation 21:1-8')
  })
})

describe('resolveGuideReferenceForFetch', () => {
  it('fixes Malachi cross-chapter morning prayer (17 Oct 2026)', () => {
    expect(resolveGuideReferenceForFetch('Mal. 3:13-4-6')).toBe('Malachi 3:13-4:6')
  })

  it('fixes Isaiah cross-chapter range', () => {
    expect(resolveGuideReferenceForFetch('Isa. 11:10-12-16')).toBe('Isaiah 11:10-12:16')
  })

  it('joins Job compound morning lines', () => {
    expect(resolveGuideReferenceForFetch('Job 4:1 & 5:1-16')).toBe('Job 4:1-5:1-16')
  })
})
