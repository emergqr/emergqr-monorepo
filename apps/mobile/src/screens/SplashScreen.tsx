import React from 'react'
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * A splash screen component displayed during app initialization.
 * It shows the app logo and a loading indicator.
 */
const SplashScreen = () => {
  const { themeColors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: themeColors.background,
      flex: 1,
      justifyContent: 'center',
    },
    image: {
      height: 200,
      marginBottom: 40,
      width: 150,
    },
  })

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/short/logo_bluegreenR.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={themeColors.primary} />
    </View>
  )
}

export default SplashScreen
