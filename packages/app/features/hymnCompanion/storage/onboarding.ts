import AsyncStorage from '@react-native-async-storage/async-storage'

const ONBOARDING_KEY = 'hymn_match_onboarding_complete_v1'

export async function isOnboardingComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true'
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
}
