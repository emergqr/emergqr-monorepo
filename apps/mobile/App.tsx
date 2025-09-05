import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useEffect } from 'react'
import { es, registerTranslation } from 'react-native-paper-dates'
import { I18nextProvider } from 'react-i18next'
// Importamos desde nuestro nuevo paquete centralizado
import i18n from '@emergqr/i18n'
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
// Importamos desde nuestro nuevo paquete centralizado
import { ThemeProvider, useTheme } from '@emergqr/theme'
import AppNavigator from './src/navigation/AppNavigator'
import ThemedStatusBar from './src/components/ThemedStatusBar'
import NetworkStatusListener from './src/components/NetworkStatusListener'
import NetworkStatusNotifier from './src/components/NetworkStatusNotifier'
import Toast from 'react-native-toast-message'
import { AppNavigationTheme } from './src/navigation/navigationTheme'
import { setupApiInterceptors } from './src/services/apiInterceptors'
import { useAuthStore } from '@/store/auth/auth.store'
import { getToken } from '@/services/auth/tokenService'
import { SnackbarProvider } from '@/contexts/SnackbarContext'

// Registramos el idioma español para el componente de calendario
registerTranslation('es', es)

const AppContent = () => {
  const { theme, themeColors } = useTheme()
  const isDarkMode = theme === 'dark'

  const paperTheme = {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
      ...themeColors,
    },
  }

  const navigationTheme = isDarkMode
    ? AppNavigationTheme.dark
    : AppNavigationTheme.light
  const signOut = useAuthStore((state) => state.signOut)

  useEffect(() => {
    setupApiInterceptors(getToken, signOut, i18n)
  }, [signOut])

  return (
    <PaperProvider theme={paperTheme}>
      <SnackbarProvider>
        <NavigationContainer theme={navigationTheme}>
          <NetworkStatusListener />
          <ThemedStatusBar />
          <AppNavigator />
          <NetworkStatusNotifier />
        </NavigationContainer>
      </SnackbarProvider>
    </PaperProvider>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AppContent />
          <Toast />
        </ThemeProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  )
}
