import { Text, YStack } from '@my/ui'
import { TYPE } from '../constants'
import type { ScriptureVerse } from '../types'

type ScripturePassageTextProps = {
  text: string
  verses?: ScriptureVerse[]
}

export function ScripturePassageText({ text, verses }: ScripturePassageTextProps) {
  if (verses && verses.length > 0) {
    const chapters = new Set(verses.map((v) => v.chapter))
    const multiChapter = chapters.size > 1

    return (
      <YStack gap="$3">
        {verses.map((v) => {
          const label = multiChapter ? `${v.chapter}:${v.verse}` : String(v.verse)
          return (
            <Text
              key={`${v.chapter}-${v.verse}`}
              {...TYPE.scripture}
              color="$color12"
            >
              <Text
                fontWeight="800"
                color="$blue11"
              >
                {label}{' '}
              </Text>
              {v.text}
            </Text>
          )
        })}
      </YStack>
    )
  }

  return (
    <Text
      {...TYPE.scripture}
      color="$color12"
    >
      {text}
    </Text>
  )
}
