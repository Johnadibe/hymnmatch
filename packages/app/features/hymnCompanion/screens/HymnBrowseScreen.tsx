import { useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, PressPresets, Text, YStack } from '@my/ui'
import { HymnInput } from '../components/HymnInput'
import { ChevronRight } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { SurfaceCard } from '../components/SurfaceCard'
import { hymnCatalog } from '../data/hymnCatalog'

export function HymnBrowseScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return hymnCatalog
    return hymnCatalog.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.themes.some((t) => t.toLowerCase().includes(q)) ||
        h.collectionLabel.toLowerCase().includes(q) ||
        String(h.number).includes(q)
    )
  }, [query])

  return (
    <AppScreen
      title="Hymn library"
      subtitle="Browse hymns in the app catalogue. Igbo hymnbook entries will appear here once uploaded."
    >
      <HymnInput
        size="$4"
        placeholder="Search title, theme, or number…"
        value={query}
        onChangeText={setQuery}
      />
      <Text
        fontSize={13}
        color="$color10"
      >
        {filtered.length} hymn{filtered.length === 1 ? '' : 's'}
      </Text>
      {filtered.map((hymn) => (
        <SurfaceCard
          key={hymn.id}
          accent="blue"
        >
          <Text
            fontSize={12}
            color="$color10"
          >
            {hymn.collectionLabel} · #{hymn.number}
          </Text>
          <Text
            fontSize={18}
            fontWeight="700"
          >
            {hymn.title}
          </Text>
          <Text
            fontSize={13}
            color="$color11"
          >
            {hymn.themes.slice(0, 4).join(' · ')}
          </Text>
          <Button
            {...PressPresets.primary}
            iconAfter={ChevronRight}
            onPress={() =>
              router.push({
                pathname: '/hymn/[id]',
                params: { id: hymn.id },
              })
            }
          >
            View details
          </Button>
        </SurfaceCard>
      ))}
    </AppScreen>
  )
}
