import { memo, useCallback, useMemo, useState } from 'react'
import { FlatList, Pressable, type ListRenderItemInfo } from 'react-native'
import { useRouter } from 'expo-router'
import { Text, XStack, YStack } from '@my/ui'
import { ChevronRight } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { HymnLibrarySearchField } from '../components/HymnLibrarySearchField'
import { SurfaceCard } from '../components/SurfaceCard'
import { filterHymnCatalog } from '../data/hymnCatalog'
import { TYPE } from '../constants'
import type { HymnCatalogEntry } from '../types'

type HymnRowProps = {
  hymn: HymnCatalogEntry
  onPress: (id: string) => void
}

const HymnRow = memo(function HymnRow({ hymn, onPress }: HymnRowProps) {
  return (
    <Pressable
      onPress={() => onPress(hymn.id)}
      accessibilityRole="button"
      accessibilityLabel={`Abu ${hymn.number}, ${hymn.title}`}
    >
      <SurfaceCard accent="blue">
        <YStack gap="$2">
          <Text
            {...TYPE.caption}
            color="$color10"
          >
            Abu {hymn.number}
          </Text>
          <Text
            fontSize={18}
            fontWeight="700"
          >
            {hymn.title}
          </Text>
          <Text
            {...TYPE.bodySmall}
            color="$color10"
            fontStyle="italic"
          >
            {hymn.titleEnglish}
          </Text>
          <Text
            {...TYPE.bodySmall}
            color="$color11"
          >
            {hymn.themes.slice(0, 4).join(' · ')}
          </Text>
          <XStack
            alignItems="center"
            gap="$1"
          >
            <Text
              {...TYPE.bodySmall}
              fontWeight="600"
              color="$blue10"
            >
              View details
            </Text>
            <ChevronRight
              size={16}
              color="$blue10"
            />
          </XStack>
        </YStack>
      </SurfaceCard>
    </Pressable>
  )
})

export function HymnBrowseScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => filterHymnCatalog(query), [query])

  const onOpenHymn = useCallback(
    (id: string) => {
      router.push({
        pathname: '/hymn/[id]',
        params: { id },
      })
    },
    [router]
  )

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HymnCatalogEntry>) => (
      <HymnRow
        hymn={item}
        onPress={onOpenHymn}
      />
    ),
    [onOpenHymn]
  )

  const listHeader = useMemo(
    () => (
      <Text
        {...TYPE.bodySmall}
        color="$color10"
        marginBottom="$2"
      >
        {filtered.length} hymn{filtered.length === 1 ? '' : 's'}
        {query.trim() ? ` matching “${query.trim()}”` : ''}
      </Text>
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
          No hymns found
        </Text>
        <Text
          {...TYPE.bodySmall}
          color="$color10"
          textAlign="center"
        >
          Try an Abu number (e.g. 8), an English line (e.g. immortal), or Igbo without tone marks (e.g.
          Chineke).
        </Text>
      </YStack>
    ),
    []
  )

  return (
    <AppScreen
      scroll={false}
      title="Hymn library"
      subtitle="Search by Abu number, Igbo title, or English equivalent."
      headerExtra={
        <HymnLibrarySearchField
          value={query}
          onChangeText={setQuery}
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
          contentContainerStyle={{
            paddingBottom: 24,
            flexGrow: filtered.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => (
            <YStack height={12} />
          )}
        />
      </YStack>
    </AppScreen>
  )
}
