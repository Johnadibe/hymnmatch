import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button, PressPresets, Text } from '@my/ui'
import { HymnTextArea } from '../components/HymnInput'
import { Star } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { SurfaceCard } from '../components/SurfaceCard'
import { getHymnById } from '../data/hymnCatalog'
import { getMatchSession } from '../storage/sessionReading'
import { savePreparation } from '../storage/savedPreparations'
import type { SavedPreparation } from '../types'

export function HymnDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const id = String(params.id ?? '')
  const hymn = getHymnById(id)

  const [reference, setReference] = useState('')
  const [sermonTitle, setSermonTitle] = useState('')
  const [dateKey, setDateKey] = useState('')
  const [sermonThemes, setSermonThemes] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      const session = await getMatchSession()
      if (!session) return
      setReference(session.reading.reference)
      setSermonTitle(session.reading.title)
      setDateKey(session.reading.date)
      setSermonThemes(session.sermonThemes ?? [])
      setNotes(session.themeHint)
    })()
  }, [])

  if (!hymn) {
    return (
      <AppScreen
        title="Hymn not found"
        subtitle="This hymn is not in the catalogue."
        onBack={() => router.back()}
      >
        <Button
          {...PressPresets.primary}
          onPress={() => router.back()}
        >
          Go back
        </Button>
      </AppScreen>
    )
  }

  const onSave = async () => {
    setSaving(true)
    try {
      const entry: SavedPreparation = {
        id: `${dateKey || 'day'}-${hymn.id}-${Date.now()}`,
        date: dateKey || new Date().toISOString().slice(0, 10),
        reference,
        sermonTheme: notes || sermonThemes.join(', ') || sermonTitle,
        notes,
        selectedHymnIds: [hymn.id],
        createdAt: new Date().toISOString(),
      }
      await savePreparation(entry)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppScreen
      title={hymn.title}
      subtitle={`${hymn.collectionLabel} · Hymn ${hymn.number}`}
      onBack={() => router.back()}
    >
      {hymn.firstLine ? (
        <SurfaceCard accent="blue">
          <Text
            fontSize={16}
            fontStyle="italic"
            lineHeight={24}
            color="$color11"
          >
            “{hymn.firstLine}”
          </Text>
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <Text fontWeight="700">Themes</Text>
        <Text color="$color11">{hymn.themes.join(' · ')}</Text>
      </SurfaceCard>

      <SurfaceCard>
        <Text fontWeight="700">Scripture (editorial)</Text>
        <Text color="$color11">{hymn.scriptureRefs.join(' · ')}</Text>
      </SurfaceCard>

      {reference ? (
        <SurfaceCard accent="green">
          <Text fontWeight="700">Sermon context</Text>
          <Text color="$color11">
            {reference} · {sermonTitle}
          </Text>
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <Text fontWeight="700">Preparation notes</Text>
        <HymnTextArea
          value={notes}
          onChangeText={setNotes}
          minHeight={100}
          placeholder="Why this hymn supports today's message…"
        />
      </SurfaceCard>

      <Button
        size="$5"
        {...PressPresets.primary}
        icon={Star}
        disabled={saving}
        onPress={() => void onSave()}
      >
        {saved ? 'Saved offline' : saving ? 'Saving…' : 'Save preparation'}
      </Button>

      <Text
        fontSize={12}
        color="$color9"
        lineHeight={18}
      >
        Full authorised lyrics can be added once you confirm distribution rights for your hymnbook.
      </Text>
    </AppScreen>
  )
}
