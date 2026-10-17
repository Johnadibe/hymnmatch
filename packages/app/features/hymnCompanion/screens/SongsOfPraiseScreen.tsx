import { memo, useCallback, useMemo, useState } from 'react'
import { FlatList, Pressable, type ListRenderItemInfo } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Text, XStack, YStack } from '@my/ui'
import { ChevronRight, Music2 } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { HymnLibrarySearchField } from '../components/HymnLibrarySearchField'
import { SurfaceCard } from '../components/SurfaceCard'
import { SONGS_OF_PRAISE_COUNT } from '../data/songsOfPraiseCatalog'
import { searchSongsOfPraiseCatalog } from '../data/songsOfPraiseSearch'
import { TYPE } from '../constants'
import type { SongOfPraiseEntry } from '../types'

function previewLine(lyrics: string, title: string): string {
  const line = lyrics
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && l !== title)
  return line ?? ''
}

type SongRowProps = {
  song: SongOfPraiseEntry
  onPress: (number: number) => void
}

const SongRow = memo(function SongRow({ song, onPress }: SongRowProps) {
  const preview = previewLine(song.lyrics, song.title)

  return (
    <Pressable
      onPress={() => onPress(song.number)}
      accessibilityRole="button"
      accessibilityLabel={`Song ${song.number}, ${song.title}`}
    >
      <SurfaceCard accent="amber">
        <XStack
          gap="$3"
          alignItems="flex-start"
        >
          <LinearGradient
            colors={['#F59E0B', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              color="white"
              fontWeight="800"
              fontSize={16}
            >
              {song.number}
            </Text>
          </LinearGradient>
          <YStack
            flex={1}
            gap="$1.5"
          >
            <Text
              fontSize={17}
              fontWeight="700"
              lineHeight={22}
              color="$color12"
            >
              {song.title}
            </Text>
            {preview ? (
              <Text
                {...TYPE.bodySmall}
                color="$color10"
                numberOfLines={2}
              >
                {preview}
              </Text>
            ) : null}
            <XStack
              alignItems="center"
              gap="$1"
              marginTop="$1"
            >
              <Text
                {...TYPE.bodySmall}
                fontWeight="600"
                color="$orange10"
              >
                Read full song
              </Text>
              <ChevronRight
                size={16}
                color="$orange10"
              />
            </XStack>
          </YStack>
        </XStack>
      </SurfaceCard>
    </Pressable>
  )
})

export function SongsOfPraiseScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => searchSongsOfPraiseCatalog(query), [query])

  const onOpenSong = useCallback(
    (number: number) => {
      router.push({
        pathname: '/praise/[number]',
        params: { number: String(number) },
      })
    },
    [router]
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SongOfPraiseEntry>) => (
      <SongRow
        song={item}
        onPress={onOpenSong}
      />
    ),
    [onOpenSong]
  )

  const listHeader = useMemo(
    () => (
      <YStack
        gap="$3"
        marginBottom="$2"
      >
        <SurfaceCard accent="amber">
          <XStack
            alignItems="center"
            gap="$3"
          >
            <Music2
              size={32}
              color="$orange10"
            />
            <YStack
              flex={1}
              gap="$1"
            >
              <Text
                fontWeight="700"
                fontSize={16}
              >
                Fellowship worship book
              </Text>
              <Text
                {...TYPE.bodySmall}
                color="$color10"
              >
                All {SONGS_OF_PRAISE_COUNT} songs from the ACPPB Songs of Praise booklet. Search by
                number or any line you remember.
              </Text>
            </YStack>
          </XStack>
        </SurfaceCard>
        <Text
          {...TYPE.bodySmall}
          color="$color10"
        >
          {filtered.length} song{filtered.length === 1 ? '' : 's'}
          {query.trim() ? ` matching “${query.trim()}”` : ''}
        </Text>
      </YStack>
    ),
    [filtered.length, query]
  )

  const listEmpty = useMemo(
    () => (
      <YStack
        padding="$6"
        alignItems="center"
        gap="$2"
      >
        <Text
          fontSize={16}
          fontWeight="700"
          textAlign="center"
        >
          No songs found
        </Text>
        <Text
          {...TYPE.bodySmall}
          color="$color10"
          textAlign="center"
        >
          Try a song number (e.g. 59), Igbo or English words from the lyrics, or a scripture phrase
          in quotes.
        </Text>
      </YStack>
    ),
    []
  )

  return (
    <AppScreen
      scroll={false}
      title="Songs of Praise"
      subtitle="ACPPB worship collection · read and prepare offline."
      headerExtra={
        <HymnLibrarySearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Song #, Igbo or English lyrics..."
        />
      }
    >
      <YStack flex={1}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          initialNumToRender={14}
          maxToRenderPerBatch={20}
          windowSize={8}
          contentContainerStyle={{
            paddingBottom: 24,
            flexGrow: filtered.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <YStack height={12} />}
        />
      </YStack>
    </AppScreen>
  )
}
