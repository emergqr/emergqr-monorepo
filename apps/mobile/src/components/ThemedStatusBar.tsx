import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useThemeStore } from '@/store/theme/theme.store'

const ThemedStatusBar = () => {
  const theme = useThemeStore((state) => state.theme)
  // El estilo de la barra de estado debe ser 'light' en un fondo oscuro, y 'dark' en un fondo claro.
  return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
}

export default ThemedStatusBar
