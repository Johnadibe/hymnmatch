import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, PressPresets, Text } from '@my/ui'
import { BookMarked, Trash2 } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { LoadingBlock } from '../components/LoadingBlock'
import { SurfaceCard } from '../components/SurfaceCard'
import { getHymnById } from '../data/hymnCatalog'
import { deletePreparation, loadPreparations } from '../storage/savedPreparations'
import { TYPE } from '../constants'
import type { SavedPreparation } from '../types'

export function SavedScreen() {
  const router = useRouter()
  const [items, setItems] = useState<SavedPreparation[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setItems(await loadPreparations())
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <AppScreen
      title="Saved preparations"
      subtitle="Stored on this device and available offline after you save."
    >
      {loading ? (
        <LoadingBlock label="Loading…" />
      ) : items.length === 0 ? (
        <SurfaceCard accent="blue">
          <BookMarked
            size={32}
            color="$blue10"
          />
          <Text
            fontWeight="700"
            fontSize={17}
          >
            Nothing saved yet
          </Text>
          <Text
            color="$color11"
            {...TYPE.body}
          >
            From Today, find matching hymns and tap Save on a hymn you choose. It will appear here.
          </Text>
          <Button
            {...PressPresets.primary}
            onPress={() => router.push('/(tabs)/today')}
          >
            Go to Today
          </Button>
        </SurfaceCard>
      ) : (
        items.map((item) => {
          const hymn = getHymnById(item.selectedHymnIds[0] ?? '')
          return (
            <SurfaceCard
              key={item.id}
              accent="green"
            >
              <Text
                fontWeight="700"
                {...TYPE.body}
              >
                {item.date} · {item.reference}
              </Text>
              <Text
                color="$color11"
                {...TYPE.body}
              >
                {item.sermonTheme}
              </Text>
              {hymn ? (
                <Text
                  fontWeight="600"
                  {...TYPE.body}
                >
                  #{hymn.number} {hymn.title}
                </Text>
              ) : null}
              {item.notes ? (
                <Text {...TYPE.bodySmall}>{item.notes}</Text>
              ) : null}
              <Button
                {...PressPresets.secondary}
                icon={Trash2}
                alignSelf="flex-start"
                onPress={() => void deletePreparation(item.id).then(refresh)}
              >
                Remove
              </Button>
            </SurfaceCard>
          )
        })
      )}
    </AppScreen>
  )
}
