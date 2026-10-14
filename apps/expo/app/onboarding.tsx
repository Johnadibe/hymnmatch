import { OnboardingScreen } from 'app/features/hymnCompanion/screens/OnboardingScreen'
import { Stack } from 'expo-router'

export default function OnboardingRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreen />
    </>
  )
}
