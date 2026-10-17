import { useLocalSearchParams, useRouter } from 'expo-router'
import { Text, YStack } from '@my/ui'
import { AppScreen } from '../components/AppScreen'
import { SurfaceCard } from '../components/SurfaceCard'
import { getSongOfPraiseByNumber } from '../data/songsOfPraiseCatalog'
import { TYPE } from '../constants'

export function SongOfPraiseDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const number = Number.parseInt(String(params.number ?? ''), 10)
  const song = Number.isFinite(number) ? getSongOfPraiseByNumber(number) : undefined

  if (!song) {
    return (
      <AppScreen
        title="Song not found"
        subtitle="This entry is not in the Songs of Praise book."
        onBack={() => router.back()}
      >
        <Text
          color="$color11"
          {...TYPE.body}
        >
          Go back and pick another song from the list.
        </Text>
      </AppScreen>
    )
  }

  return (
    <AppScreen
      title={`Song ${song.number}`}
      subtitle={song.title}
      onBack={() => router.back()}
    >
      <SurfaceCard accent="amber">
        <YStack gap="$3">
          <Text
            {...TYPE.caption}
            color="$orange10"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing={1}
          >
            ACPPB Songs of Praise
          </Text>
          <Text
            fontSize={22}
            fontWeight="700"
            lineHeight={30}
            color="$color12"
          >
            {song.title}
          </Text>
          <Text
            {...TYPE.body}
            color="$color11"
            lineHeight={26}
            fontSize={17}
          >
            {song.lyrics}
          </Text>
        </YStack>
      </SurfaceCard>
    </AppScreen>
  )
}
