import { useEffect } from 'react'
import { useColorScheme, LogBox } from 'react-native'

LogBox.ignoreLogs([/is not a valid color/])
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { Provider } from 'app/provider'
import { defaultScreenOptions } from 'app/navigation/config'
import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

// Keep native splash visible until bootstrap screen calls hideAsync()
void ExpoSplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            ...defaultScreenOptions,
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </Provider>
  )
}
