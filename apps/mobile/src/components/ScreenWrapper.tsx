import React from 'react'
import { ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ScreenWrapperProps {
  children: React.ReactNode
  style?: ViewStyle
}

const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
  const theme = useTheme()
  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  }

  return <SafeAreaView style={[containerStyle, style]}>{children}</SafeAreaView>
}

export default ScreenWrapper
