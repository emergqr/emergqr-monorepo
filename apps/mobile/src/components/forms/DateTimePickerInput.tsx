import React, { useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Controller, Control } from 'react-hook-form'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { HelperText, TextInput } from 'react-native-paper'
import { formatDateForDisplay } from '@/utils/dateFormatter'

interface DatePickerInputProps {
  control: Control<Record<string, unknown>>
  name: string
  label: string
  placeholder?: string
  mode?: 'date' | 'time' | 'datetime'
}

const DateTimePickerInput: React.FC<DatePickerInputProps> = ({
  control,
  name,
  label,
  placeholder,
  mode = 'date',
}) => {
  const [showPicker, setShowPicker] = useState(false)

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
  })

  const formatValueForDisplay = (date: Date): string => {
    if (!date) return ''
    if (mode === 'datetime') {
      // Formato simple para fecha y hora, ej: "23/10/2023, 14:30"
      // Se puede mejorar con una librería como date-fns si se necesita más control
      return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    }
    // Usa la función existente para formato de solo fecha
    return formatDateForDisplay(date)
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleDateChange = (
          event: DateTimePickerEvent,
          selectedDate?: Date,
        ) => {
          // Oculta el selector en cualquier plataforma después de la interacción
          setShowPicker(false)
          // Actualiza el valor solo si el usuario confirmó una fecha
          if (event.type === 'set' && selectedDate) {
            onChange(selectedDate)
          }
        }

        return (
          <View style={styles.container}>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  label={label}
                  placeholder={placeholder}
                  value={value ? formatValueForDisplay(value as Date) : ''}
                  editable={false}
                  error={!!error}
                  right={
                    <TextInput.Icon
                      icon={mode === 'time' ? 'clock-outline' : 'calendar'}
                    />
                  }
                />
              </View>
            </TouchableOpacity>
            {error && <HelperText type="error">{error.message}</HelperText>}
            {showPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={(value as Date) || new Date()}
                mode={mode}
                display="default"
                onChange={handleDateChange}
                maximumDate={mode === 'date' ? new Date() : undefined}
              />
            )}
          </View>
        )
      }}
    />
  )
}

export default DateTimePickerInput
