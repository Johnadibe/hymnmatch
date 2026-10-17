/** Present Abu lyrics with booklet wording (Stanza, not Verse). */
export function formatLyricsForDisplay(lyrics: string): string {
  return lyrics.replace(/^Verse (\d+)$/gim, 'Stanza $1')
}
