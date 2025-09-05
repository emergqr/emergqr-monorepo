import React, { FC } from 'react'
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

interface FormInputProps extends TextInputProps {
  label: string
  error?: string | null
}

const FormInput: FC<FormInputProps> = ({ label, error, ...props }) => {
  const { themeColors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    errorText: {
      color: themeColors.alert,
      fontSize: 14,
      marginTop: 5,
    },
    input: {
      backgroundColor: themeColors.inputBackground,
      borderColor: error ? themeColors.alert : themeColors.border,
      borderRadius: 8,
      borderWidth: 1,
      color: themeColors.text,
      fontSize: 16,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    label: {
      color: themeColors.text,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={themeColors.placeholder}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export default FormInput
