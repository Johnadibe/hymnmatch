import { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { ThumbsDown, ThumbsUp } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { ErrorPanel } from '../components/ErrorPanel'
import { LoadingBlock } from '../components/LoadingBlock'
import { SurfaceCard } from '../components/SurfaceCard'
import { getHymnById } from '../data/hymnCatalog'
import { matchHymnsWithGemini } from '../services/geminiHymnMatch'
import { getActiveReading, setMatchSession } from '../storage/sessionReading'
import { explainMatchError } from '../utils/friendlyErrors'
import type { DailyReading, MatchResult } from '../types'

export function SuggestionsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const themeHint = String(params.themeHint ?? '')

  const [reading, setReading] = useState<DailyReading | null>(null)
  const [readingLoaded, setReadingLoaded] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'good' | 'poor' | null>(null)

  useEffect(() => {
    void (async () => {
      const active = await getActiveReading()
      setReading(active)
      setReadingLoaded(true)
    })()
  }, [])

  const loadMatches = useCallback(async () => {
    if (!reading) return
    setLoading(true)
    setError(null)
    try {
      const match = await matchHymnsWithGemini(reading, {
        sermonThemeHint: themeHint || undefined,
      })
      setResult(match)
      await setMatchSession({ reading, themeHint, sermonThemes: match.sermonThemes })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Matching failed')
    } finally {
      setLoading(false)
    }
  }, [reading, themeHint])

  useEffect(() => {
    if (reading) void loadMatches()
  }, [reading, loadMatches])

  if (readingLoaded && !reading) {
    return (
      <AppScreen
        title="No passage loaded"
        subtitle="Start from Today and tap Find matching hymns."
        onBack={() => router.replace('/(tabs)/today')}
      >
        <Button
          {...PressPresets.primary}
          onPress={() => router.replace('/(tabs)/today')}
        >
          Go to Today
        </Button>
      </AppScreen>
    )
  }

  if (!reading) {
    return (
      <AppScreen
        title="Suggested hymns"
        subtitle="Preparing your sermon context…"
      >
        <LoadingBlock minimal />
      </AppScreen>
    )
  }

  const matchErr = error ? explainMatchError(error) : null

  return (
    <AppScreen
      title="Suggested hymns"
      subtitle={`${reading.reference} · ${reading.title}`}
      onBack={() => router.back()}
    >
      {loading ? <LoadingBlock label="Finding hymns…" /> : null}

      {matchErr ? (
        <ErrorPanel
          title={matchErr.title}
          message={matchErr.message}
          hint={matchErr.hint}
          onRetry={() => void loadMatches()}
        />
      ) : null}

      {result?.sermonThemes?.length ? (
        <YStack gap="$2">
          <Text fontWeight="700">Themes identified</Text>
          <XStack
            flexWrap="wrap"
            gap="$2"
          >
            {result.sermonThemes.map((theme) => (
              <Text
                key={theme}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$10"
                backgroundColor="$blue3"
                color="$blue11"
                fontSize={13}
                fontWeight="600"
              >
                {theme}
              </Text>
            ))}
          </XStack>
        </YStack>
      ) : null}

      {result?.recommendations.map((rec, index) => {
        const hymn = getHymnById(rec.hymnId)
        if (!hymn) return null
        return (
          <SurfaceCard
            key={rec.hymnId}
            accent={index === 0 ? 'green' : 'blue'}
          >
            <Text
              fontSize={12}
              color="$color10"
              fontWeight="600"
              textTransform="uppercase"
            >
              Suggestion {index + 1} · {rec.fitStrength} fit
            </Text>
            <Text
              fontSize={20}
              fontWeight="800"
            >
              #{hymn.number} · {hymn.title}
            </Text>
            <Text
              fontSize={13}
              color="$color10"
            >
              {hymn.collectionLabel}
            </Text>
            <Text lineHeight={22}>{rec.reason}</Text>
            {rec.matchedThemes.length ? (
              <Text
                fontSize={13}
                color="$color11"
              >
                Themes: {rec.matchedThemes.join(', ')}
              </Text>
            ) : null}
            <Button
              {...PressPresets.primary}
              onPress={() =>
                router.push({
                  pathname: '/hymn/[id]',
                  params: { id: hymn.id },
                })
              }
            >
              View hymn details
            </Button>
          </SurfaceCard>
        )
      })}

      {!loading && result ? (
        <SurfaceCard>
          <Text fontWeight="700">Was this helpful?</Text>
          <XStack gap="$2">
            <Button
              flex={1}
              {...PressPresets.secondary}
              icon={ThumbsUp}
              onPress={() => setFeedback('good')}
              backgroundColor={feedback === 'good' ? '$green3' : undefined}
            >
              Good match
            </Button>
            <Button
              flex={1}
              {...PressPresets.secondary}
              icon={ThumbsDown}
              onPress={() => setFeedback('poor')}
              backgroundColor={feedback === 'poor' ? '$red3' : undefined}
            >
              Poor match
            </Button>
          </XStack>
          {feedback ? (
            <Text
              fontSize={13}
              color="$color10"
            >
              Thank you. Your feedback helps improve future hymn tagging.
            </Text>
          ) : null}
        </SurfaceCard>
      ) : null}
    </AppScreen>
  )
}
