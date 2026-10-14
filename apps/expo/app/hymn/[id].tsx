import { HymnDetailScreen } from 'app/features/hymnCompanion/screens/HymnDetailScreen'
import { Stack } from 'expo-router'

export default function HymnDetailRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HymnDetailScreen />
    </>
  )
}
