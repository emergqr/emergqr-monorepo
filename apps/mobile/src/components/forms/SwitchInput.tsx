import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Control, Controller } from 'react-hook-form'
import { Switch } from 'react-native-paper'
import { useTheme } from '@/contexts/ThemeContext'

interface SwitchInputProps {
  control: Control<Record<string, unknown>> // Se ha reemplazado 'any' por un tipo más seguro
  name: string
  label: string
}

const SwitchInput: React.FC<SwitchInputProps> = ({ control, name, label }) => {
  const { themeColors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingVertical: 8, // Añade un poco de espacio vertical
    },
    label: {
      color: themeColors.text,
      fontSize: 16,
    },
  })

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <Switch
            value={!!value} // Asegura que el valor sea siempre booleano
            onValueChange={onChange}
            color={themeColors.primary}
          />
        </View>
      )}
    />
  )
}

export default SwitchInput
