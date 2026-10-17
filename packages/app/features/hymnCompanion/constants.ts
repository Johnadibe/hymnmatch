/** Number of hymn recommendations shown per sermon / passage match. */
export const HYMN_SUGGESTION_COUNT = 7

/** Readable type scale for chapel use (slightly larger than default UI). */
export const TYPE = {
  scripture: { fontSize: 17, lineHeight: 27 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 15, lineHeight: 22 },
  caption: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 12, lineHeight: 17 },
} as const
