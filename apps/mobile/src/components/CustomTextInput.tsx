import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { TextInput, TextInputProps } from 'react-native-paper'
import { useTheme } from '@/contexts/ThemeContext'

// The component now accepts all props from react-native-paper's TextInput
const CustomTextInput: React.FC<TextInputProps> = ({
  style,
  error,
  ...props
}) => {
  const { themeColors } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        input: {
          backgroundColor: themeColors.card,
        },
      }),
    [themeColors],
  )

  return (
    <TextInput
      style={[styles.input, style]}
      mode="outlined"
      error={error}
      textColor={themeColors.text}
      placeholderTextColor={themeColors.placeholder}
      outlineColor={error ? themeColors.alert : themeColors.border}
      activeOutlineColor={error ? themeColors.alert : themeColors.primary}
      {...props}
    />
  )
}

export default CustomTextInput
