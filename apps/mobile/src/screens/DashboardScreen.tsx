import React, { useMemo, FC } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { useAuthStore as useAuth } from '@/store/auth/auth.store'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext' // For colors
import { useNetworkStore } from '@/store/network/network.store'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

const DashboardScreen: FC = () => {
  const { t, i18n } = useTranslation()
  const { theme, setTheme, themeColors } = useTheme()
  const signOut = useAuth((state) => state.signOut)
  const user = useAuth((state) => state.user)
  const isOnline = useNetworkStore((state) => state.isOnline)
  const navigation = useNavigation()

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(newLang)
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleSignOut = () => {
    // Llamamos a la acción asíncrona signOut.
    // Añadimos un .catch() para prevenir advertencias de "promesa no manejada"
    // en caso de que ocurra un error inesperado durante el cierre de sesión.
    signOut().catch((error) => {
      console.error('An error occurred during sign out:', error)
    })
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: themeColors.background,
          flex: 1,
        },
        content: {
          paddingHorizontal: 20,
        },
        userInfo: {
          fontSize: 22, // Reducimos el tamaño para un saludo más sutil
          fontWeight: '500', // Hacemos la fuente un poco menos pesada
          color: themeColors.text,
        },
        welcomeContainer: {
          alignItems: 'center',
          paddingVertical: 30,
        },
      }),
    [themeColors],
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <DashboardHeader
          theme={theme}
          isOffline={!isOnline}
          onMenuPress={handleMenuPress}
          onLanguageToggle={handleLanguageToggle}
          onThemeToggle={handleThemeToggle}
          onSignOut={handleSignOut}
        />

        {/* -- Contenido Principal de la Pantalla -- */}
        <View style={styles.welcomeContainer}>
          {user && (
            <Text style={styles.userInfo}>
              {t('dashboard.loggedInAs', { name: user.name })}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DashboardScreen
