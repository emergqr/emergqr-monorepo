import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useAuthStore } from '@/store/auth/auth.store'
import { useNetworkStore } from '@/store/network/network.store'
import { useTheme } from '@/contexts/ThemeContext'
import AuthNavigator from './AuthNavigator'
import DrawerNavigator from './DrawerNavigator'
import OfflineNavigator from './OfflineNavigator'

/**
 * The main navigator component for the application.
 * It conditionally renders authentication screens or the main app screens
 * based on the user's authentication status.
 */
const AppNavigator = () => {
  const { isLoading, isAuthenticated, checkAuthStatus } = useAuthStore()
  const { isOnline } = useNetworkStore()
  const { themeColors } = useTheme()

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: themeColors.background,
        }}
      >
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    )
  }

  if (isAuthenticated) {
    // Si está autenticado, decidimos qué navegador mostrar basado en el estado de la red.
    return isOnline ? <DrawerNavigator /> : <OfflineNavigator />
  }

  // Si no está autenticado, mostramos el navegador de login/registro.
  return <AuthNavigator />
}

export default AppNavigator
