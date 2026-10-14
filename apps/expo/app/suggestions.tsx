import { SuggestionsScreen } from 'app/features/hymnCompanion/screens/SuggestionsScreen'
import { Stack } from 'expo-router'

export default function SuggestionsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SuggestionsScreen />
    </>
  )
}
