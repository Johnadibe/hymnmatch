import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { ChevronRight, Music2 } from '@tamagui/lucide-icons'
import type { HymnCatalogEntry } from '../types'
import type { HymnRecommendation } from '../types'

const strengthLabel = {
  strong: 'Strong fit',
  good: 'Good fit',
  moderate: 'Moderate fit',
} as const

type HymnSuggestionCardProps = {
  rank: number
  hymn: HymnCatalogEntry
  recommendation: HymnRecommendation
  onViewDetails: () => void
}

export function HymnSuggestionCard({
  rank,
  hymn,
  recommendation,
  onViewDetails,
}: HymnSuggestionCardProps) {
  const strength = strengthLabel[recommendation.fitStrength] ?? 'Good fit'

  return (
    <YStack
      borderRadius="$5"
      overflow="hidden"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$backgroundStrong"
    >
      <LinearGradient
        colors={rank === 1 ? ['#335CFF', '#2A4AD4'] : ['#178D4E', '#1FC16B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={16}
          paddingVertical={12}
        >
          <XStack
            alignItems="center"
            gap="$2"
          >
            <View style={styles.rankBadge}>
              <Text
                color="white"
                fontWeight="800"
                fontSize={14}
              >
                {rank}
              </Text>
            </View>
            <Text
              color="rgba(255,255,255,0.92)"
              fontSize={13}
              fontWeight="600"
            >
              {strength}
            </Text>
          </XStack>
          <Music2
            size={20}
            color="rgba(255,255,255,0.9)"
          />
        </XStack>
      </LinearGradient>

      <YStack
        padding="$4"
        gap="$3"
      >
        <YStack gap="$1">
          <Text
            fontSize={12}
            color="$color10"
            fontWeight="600"
          >
            {hymn.collectionLabel}
          </Text>
          <Text
            fontSize={20}
            fontWeight="800"
            color="$color12"
            lineHeight={26}
          >
            Abu {hymn.number}
          </Text>
          <Text
            fontSize={16}
            fontWeight="600"
            color="$color11"
            lineHeight={22}
          >
            {hymn.title}
          </Text>
          <Text
            fontSize={13}
            color="$color10"
            fontStyle="italic"
            lineHeight={18}
          >
            {hymn.titleEnglish}
          </Text>
        </YStack>

        <Text
          fontSize={15}
          lineHeight={23}
          color="$color11"
        >
          {recommendation.reason}
        </Text>

        {recommendation.matchedThemes.length > 0 ? (
          <XStack
            flexWrap="wrap"
            gap="$2"
          >
            {recommendation.matchedThemes.map((theme) => (
              <Text
                key={theme}
                fontSize={12}
                fontWeight="600"
                color="$blue11"
                backgroundColor="$blue2"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$3"
              >
                {theme}
              </Text>
            ))}
          </XStack>
        ) : null}

        <Button
          {...PressPresets.secondary}
          marginTop="$1"
          iconAfter={ChevronRight}
          onPress={onViewDetails}
        >
          View in catalogue
        </Button>
      </YStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
