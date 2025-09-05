import React from 'react'
import { ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// Se ha actualizado la importación para que apunte al nuevo paquete de tema.
import { useTheme } from '@emergqr/theme'

interface ScreenWrapperProps {
  children: React.ReactNode
  style?: ViewStyle
}

const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
  // Se usa nuestro hook de tema personalizado para consistencia.
  const { themeColors } = useTheme()
  const containerStyle = {
    flex: 1,
    backgroundColor: themeColors.background,
  }

  return <SafeAreaView style={[containerStyle, style]}>{children}</SafeAreaView>
}

export default ScreenWrapper
