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
      subtitle="Stored on this device. Passage text and hymns stay available offline after you save."
    >
      {loading ? (
        <LoadingBlock label="Loading..." />
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
            From Word, load your Daily Bread passage, find matching Abu, and tap Save on the hymn
            you choose. It will appear here with the Scripture text.
          </Text>
          <Button
            {...PressPresets.primary}
            onPress={() => router.push('/(tabs)/today')}
          >
            Go to Word
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
              {item.dailyBreadSlot ? (
                <Text
                  {...TYPE.caption}
                  color="$color10"
                >
                  {item.dailyBreadSlot}
                </Text>
              ) : null}
              <Text
                color="$color11"
                {...TYPE.body}
              >
                {item.sermonTheme}
              </Text>
              {item.passageText ? (
                <Text
                  {...TYPE.bodySmall}
                  color="$color10"
                  numberOfLines={4}
                  marginTop="$2"
                >
                  {item.passageText}
                </Text>
              ) : null}
              {hymn ? (
                <Button
                  unstyled
                  {...PressPresets.listItem}
                  marginTop="$2"
                  onPress={() => router.push(`/hymn/${hymn.id}`)}
                >
                  <Text
                    fontWeight="600"
                    {...TYPE.body}
                    color="$blue11"
                  >
                    #{hymn.number} {hymn.title}
                  </Text>
                </Button>
              ) : null}
              {item.notes ? <Text {...TYPE.bodySmall}>{item.notes}</Text> : null}
              <Button
                {...PressPresets.secondary}
                icon={Trash2}
                alignSelf="flex-start"
                marginTop="$2"
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
