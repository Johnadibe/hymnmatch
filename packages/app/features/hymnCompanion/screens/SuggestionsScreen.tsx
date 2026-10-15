import { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { BookOpen, RefreshCw, ThumbsDown, ThumbsUp } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { HeaderIconButton } from '../components/HeaderIconButton'
import { ErrorPanel } from '../components/ErrorPanel'
import { HymnSuggestionCard } from '../components/HymnSuggestionCard'
import { LoadingBlock } from '../components/LoadingBlock'
import { SurfaceCard } from '../components/SurfaceCard'
import { HYMN_SUGGESTION_COUNT, TYPE } from '../constants'
import { getHymnById } from '../data/hymnCatalog'
import { matchHymnsWithGemini, type MatchResultMeta } from '../services/geminiHymnMatch'
import { getActiveReading, setMatchSession } from '../storage/sessionReading'
import { explainMatchError } from '../utils/friendlyErrors'
import type { DailyReading } from '../types'

export function SuggestionsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const themeHint = String(params.themeHint ?? '').trim()

  const [reading, setReading] = useState<DailyReading | null>(null)
  const [readingLoaded, setReadingLoaded] = useState(false)
  const [result, setResult] = useState<MatchResultMeta | null>(null)
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
    setFeedback(null)
    try {
      const match = await matchHymnsWithGemini(reading, {
        sermonThemeHint: themeHint || undefined,
      })
      setResult(match)
      await setMatchSession({ reading, themeHint, sermonThemes: match.sermonThemes })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Matching failed')
      setResult(null)
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
        title="Suggested hymns"
        subtitle="No sermon text loaded"
        onBack={() => router.replace('/(tabs)/today')}
      >
        <SurfaceCard accent="blue">
          <Text
            lineHeight={22}
            color="$color11"
          >
            Go back to Word, load your passage, then tap Find matching hymns.
          </Text>
          <Button
            {...PressPresets.primary}
            marginTop="$2"
            onPress={() => router.replace('/(tabs)/today')}
          >
            Go to Word
          </Button>
        </SurfaceCard>
      </AppScreen>
    )
  }

  if (!reading) {
    return (
      <AppScreen
        title="Suggested hymns"
        subtitle="Loading your passage…"
        onBack={() => router.back()}
      >
        <LoadingBlock minimal />
      </AppScreen>
    )
  }

  const matchErr = error ? explainMatchError(error) : null

  return (
    <AppScreen
      title="Suggested hymns"
      subtitle={reading.reference}
      onBack={() => router.back()}
      headerRight={
        !loading && result ? (
          <HeaderIconButton
            onPress={() => void loadMatches()}
            accessibilityLabel="Refresh suggestions"
          >
            <RefreshCw
              size={20}
              color="white"
            />
          </HeaderIconButton>
        ) : undefined
      }
    >
      <SurfaceCard accent="blue">
        <XStack
          alignItems="flex-start"
          gap="$3"
        >
          <YStack
            width={40}
            height={40}
            borderRadius={12}
            backgroundColor="$blue3"
            alignItems="center"
            justifyContent="center"
          >
            <BookOpen
              size={20}
              color="#335CFF"
            />
          </YStack>
          <YStack
            flex={1}
            gap="$1"
          >
            <Text
              fontWeight="700"
              {...TYPE.body}
            >
              {reading.title}
            </Text>
            {themeHint ? (
              <Text
                {...TYPE.bodySmall}
                color="$color10"
              >
                Your theme note: {themeHint}
              </Text>
            ) : (
              <Text
                {...TYPE.bodySmall}
                color="$color10"
              >
                {HYMN_SUGGESTION_COUNT} hymns chosen to support the message of this passage.
              </Text>
            )}
          </YStack>
        </XStack>
      </SurfaceCard>

      {loading ? (
        <LoadingBlock
          label="Finding hymns for your message"
          sublabel="This usually takes a few seconds."
        />
      ) : null}

      {matchErr ? (
        <ErrorPanel
          title={matchErr.title}
          message={matchErr.message}
          hint={matchErr.hint}
          onRetry={() => void loadMatches()}
        />
      ) : null}

      {result?.matchSource === 'catalogue-fallback' ? (
        <SurfaceCard accent="green">
          <Text
            {...TYPE.bodySmall}
            color="$color11"
          >
            Live suggestions were unavailable. These hymns are matched from the catalogue using
            themes in your passage. Confirm each choice with your hymnbook.
          </Text>
        </SurfaceCard>
      ) : null}

      {result?.sermonThemes?.length ? (
        <YStack gap="$2">
          <Text
            fontWeight="700"
            {...TYPE.body}
            paddingHorizontal="$1"
          >
            Message themes
          </Text>
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
                {...TYPE.caption}
                fontWeight="600"
              >
                {theme}
              </Text>
            ))}
          </XStack>
        </YStack>
      ) : null}

      {!loading && result?.recommendations.length ? (
        <YStack gap="$4">
          {result.recommendations.map((rec, index) => {
            const hymn = getHymnById(rec.hymnId)
            if (!hymn) return null
            return (
              <HymnSuggestionCard
                key={rec.hymnId}
                rank={index + 1}
                hymn={hymn}
                recommendation={rec}
                onViewDetails={() =>
                  router.push({
                    pathname: '/hymn/[id]',
                    params: { id: hymn.id },
                  })
                }
              />
            )
          })}
        </YStack>
      ) : null}

      {!loading && result && !error ? (
        <SurfaceCard>
          <Text
            fontWeight="700"
            marginBottom="$2"
          >
            Was this helpful?
          </Text>
          <XStack gap="$2">
            <Button
              flex={1}
              {...PressPresets.secondary}
              icon={ThumbsUp}
              onPress={() => setFeedback('good')}
              backgroundColor={feedback === 'good' ? '$green3' : undefined}
            >
              Helpful
            </Button>
            <Button
              flex={1}
              {...PressPresets.secondary}
              icon={ThumbsDown}
              onPress={() => setFeedback('poor')}
              backgroundColor={feedback === 'poor' ? '$red3' : undefined}
            >
              Not quite
            </Button>
          </XStack>
          {feedback ? (
            <Text
              {...TYPE.bodySmall}
              color="$color10"
              marginTop="$2"
            >
              Thank you. Your feedback helps improve future hymn tagging.
            </Text>
          ) : null}
        </SurfaceCard>
      ) : null}
    </AppScreen>
  )
}
