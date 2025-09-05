import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useEffect } from 'react'
import { es, registerTranslation } from 'react-native-paper-dates'
import { I18nextProvider } from 'react-i18next'
import i18n from './src/services/i18n' // Asegúrate que la ruta sea correcta
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext' // useTheme se usará en AppContent
import AppNavigator from './src/navigation/AppNavigator'
import ThemedStatusBar from './src/components/ThemedStatusBar'
import NetworkStatusListener from './src/components/NetworkStatusListener'
import NetworkStatusNotifier from './src/components/NetworkStatusNotifier'
import Toast from 'react-native-toast-message' // 1. Importa el componente
import { AppNavigationTheme } from './src/navigation/navigationTheme' // Interceptors are now configured directly within src/services/api.ts
import { setupApiInterceptors } from './src/services/apiInterceptors'
import { useAuthStore } from '@/store/auth/auth.store' // Import useAuthStore
import { getToken } from '@/services/auth/tokenService' // Import getToken
import { SnackbarProvider } from '@/contexts/SnackbarContext'

// Registramos el idioma español para el componente de calendario
registerTranslation('es', es)

// Llama a esta función aquí, fuera del componente, para que se ejecute una vez al iniciar la app.
// No need to call setupApiInterceptors() here.
// Ahora, setupApiInterceptors se llamará dentro de AppContent.

// Este nuevo componente vive dentro de los proveedores y puede usar sus hooks.
const AppContent = () => {
  const { theme, themeColors } = useTheme() // <-- Obtenemos el tema y los colores personalizados
  const isDarkMode = theme === 'dark'

  // Unificamos el tema de la aplicación con el de React Native Paper
  const paperTheme = {
    ...(isDarkMode ? MD3DarkTheme : MD3LightTheme), // Base del tema de Paper
    colors: {
      ...(isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors), // Colores base de Paper
      ...themeColors, // Sobrescribimos con nuestros colores personalizados
    },
  }

  const navigationTheme = isDarkMode
    ? AppNavigationTheme.dark
    : AppNavigationTheme.light
  const signOut = useAuthStore((state) => state.signOut)

  useEffect(() => {
    // Configuramos los interceptores una vez que el componente se monta.
    // Pasamos las funciones necesarias para evitar dependencias circulares.
    setupApiInterceptors(getToken, signOut, i18n)
  }, [signOut]) // signOut es una función estable de Zustand, pero la incluimos por buena práctica.

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
