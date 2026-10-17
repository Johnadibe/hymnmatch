import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text, XStack } from '@my/ui'
import { ChevronRight, Music2 } from '@tamagui/lucide-icons'

type FindMatchingHymnsButtonProps = {
  disabled?: boolean
  loading?: boolean
  onPress: () => void
}

export function FindMatchingHymnsButton({
  disabled,
  loading,
  onPress,
}: FindMatchingHymnsButtonProps) {
  const inactive = disabled || loading

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.wrap,
        inactive ? styles.wrapDisabled : null,
        pressed && !inactive ? styles.wrapPressed : null,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
    >
      <LinearGradient
        colors={inactive ? ['#94A3B8', '#64748B'] : ['#335CFF', '#2A4AD4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          paddingHorizontal={20}
          paddingVertical={16}
          gap="$3"
        >
          <View style={styles.iconBadge}>
            <Music2
              size={22}
              color="#FFFFFF"
            />
          </View>
          <Text
            flex={1}
            color="white"
            fontSize={17}
            fontWeight="700"
            letterSpacing={-0.2}
          >
            {loading ? 'Opening hymn suggestions...' : 'Find matching hymns'}
          </Text>
          <ChevronRight
            size={22}
            color="rgba(255,255,255,0.95)"
          />
        </XStack>
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2A4AD4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  wrapDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  wrapPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  gradient: {
    borderRadius: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
