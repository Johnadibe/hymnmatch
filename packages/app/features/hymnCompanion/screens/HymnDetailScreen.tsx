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
import { TYPE } from '../constants'
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
        <Text
          color="$color11"
          {...TYPE.body}
        >
          Choose another hymn from the library or suggestions list.
        </Text>
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
      title={`Abu ${hymn.number}`}
      subtitle={`${hymn.title} · ${hymn.titleEnglish}`}
      onBack={() => router.back()}
    >
      {hymn.lyricsIgbo ? (
        <SurfaceCard accent="blue">
          <Text
            fontWeight="700"
            marginBottom="$2"
          >
            Igbo text
          </Text>
          <Text
            {...TYPE.scripture}
            color="$color11"
          >
            {hymn.lyricsIgbo}
          </Text>
        </SurfaceCard>
      ) : hymn.firstLine ? (
        <SurfaceCard accent="blue">
          <Text
            {...TYPE.body}
            fontStyle="italic"
            color="$color11"
          >
            “{hymn.firstLine}”
          </Text>
        </SurfaceCard>
      ) : null}

      {hymn.englishHymnalRefs ? (
        <SurfaceCard>
          <Text fontWeight="700">English hymnbook (reference)</Text>
          <Text
            color="$color11"
            {...TYPE.body}
          >
            {hymn.englishHymnalRefs}
          </Text>
          {!hymn.verified ? (
            <Text
              {...TYPE.caption}
              color="$color9"
              marginTop="$2"
            >
              Confirm numbers with your chapel’s Ancient &amp; Modern and SS&amp;S copies.
            </Text>
          ) : null}
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <Text fontWeight="700">Themes</Text>
        <Text
          color="$color11"
          {...TYPE.body}
        >
          {hymn.themes.join(' · ')}
        </Text>
      </SurfaceCard>

      <SurfaceCard>
        <Text fontWeight="700">Scripture (editorial)</Text>
        <Text
          color="$color11"
          {...TYPE.body}
        >
          {hymn.scriptureRefs.join(' · ')}
        </Text>
      </SurfaceCard>

      {reference ? (
        <SurfaceCard accent="green">
          <Text fontWeight="700">Sermon context</Text>
          <Text
            color="$color11"
            {...TYPE.body}
          >
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
        {...TYPE.caption}
        color="$color9"
      >
        Suggestions use the English equivalent above; verify Abu {hymn.number} with your hymn leader before Sunday.
      </Text>
    </AppScreen>
  )
}
