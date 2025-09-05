import React, { useEffect, useRef } from 'react'
import { Text, StyleSheet, Animated, SafeAreaView } from 'react-native'
import { useNetworkStore } from '../store/network/network.store'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

const NetworkStatusNotifier = () => {
  const { isOffline } = useNetworkStore()
  const { themeColors } = useTheme()
  const { t } = useTranslation()
  const slideAnim = useRef(new Animated.Value(100)).current // Inicia fuera de la pantalla (abajo)

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : 100, // 0 para mostrar, 100 para ocultar
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOffline, slideAnim])

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: themeColors.alert,
      padding: 10,
    },
    text: {
      color: themeColors.background, // Texto claro sobre fondo de alerta
      fontWeight: 'bold',
    },
    wrapper: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      transform: [{ translateY: slideAnim }],
    },
  })

  return (
    <Animated.View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>{t('errors.noConnection')}</Text>
      </SafeAreaView>
    </Animated.View>
  )
}

export default NetworkStatusNotifier
