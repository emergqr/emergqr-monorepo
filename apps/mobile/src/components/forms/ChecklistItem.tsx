import React, { useMemo } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'

interface ChecklistItemProps {
  isChecked: boolean
  onPress: () => void
  labelChecked: string
  labelUnchecked: string
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  isChecked,
  onPress,
  labelChecked,
  labelUnchecked,
}) => {
  const { themeColors } = useTheme()

  const iconName = isChecked ? 'checkmark-circle' : 'close-circle-outline'
  const color = isChecked ? themeColors.success : themeColors.alert
  const label = isChecked ? labelChecked : labelUnchecked

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          backgroundColor: themeColors.card,
          borderLeftColor: color,
          borderLeftWidth: 5,
          borderRadius: 8,
          elevation: 1,
          flexDirection: 'row',
          marginBottom: 20,
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOpacity: 0.05,
        },
        icon: {
          marginRight: 12,
        },
        label: {
          color: themeColors.text,
          flex: 1,
          fontSize: 16, // Allow text to wrap
        },
      }),
    [themeColors, color],
  )

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name={iconName} size={24} color={color} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

export default ChecklistItem
