import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '@/contexts/ThemeContext'
import { VitalSignRead } from '@emergqr/core/src/domain/interfaces/client/vital-sign.interface'
import { formatDateForDisplay } from '@/utils/dateFormatter'
import VitalSignChart from './VitalSignChart'

interface VitalSignGroupProps {
  title: string
  records: VitalSignRead[]
  onAdd: () => void
  onViewHistory: () => void
}

const VitalSignGroup: React.FC<VitalSignGroupProps> = ({
  title,
  records,
  onAdd,
  onViewHistory,
}) => {
  const { themeColors } = useTheme()

  // El registro más reciente es el primero, ya que el store los ordena.
  const latestRecord = records[0]

  const displayValue = useMemo(() => {
    if (!latestRecord) return 'N/A'
    if (latestRecord.type === 'Blood Pressure') {
      return `${latestRecord.value_numeric ?? '--'}/${latestRecord.value_secondary ?? '--'}`
    }
    return (
      latestRecord.value_numeric?.toString() ?? latestRecord.value_text ?? 'N/A'
    )
  }, [latestRecord])

  const styles = StyleSheet.create({
    actionButton: {
      marginLeft: 16,
    },
    actions: {
      borderTopColor: themeColors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
      paddingTop: 10,
    },
    card: {
      backgroundColor: themeColors.card,
      borderRadius: 12,
      elevation: 3,
      marginBottom: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    date: {
      color: themeColors.secondaryText,
      fontSize: 14,
      marginBottom: 10,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    latestReadingContainer: {
      alignItems: 'baseline',
      flexDirection: 'row',
      marginBottom: 5,
    },
    title: {
      color: themeColors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    unit: {
      color: themeColors.secondaryText,
      fontSize: 16,
      marginLeft: 8,
    },
    value: {
      color: themeColors.primary,
      fontSize: 28,
      fontWeight: '700',
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.latestReadingContainer}>
        <Text style={styles.value}>{displayValue}</Text>
        <Text style={styles.unit}>{latestRecord?.unit}</Text>
      </View>
      <Text style={styles.date}>
        {latestRecord
          ? formatDateForDisplay(new Date(latestRecord.measured_at))
          : ''}
      </Text>

      <VitalSignChart data={records} />

      <View style={styles.actions}>
        <TouchableOpacity onPress={onViewHistory} style={styles.actionButton}>
          <Ionicons name="time-outline" size={26} color={themeColors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAdd} style={styles.actionButton}>
          <Ionicons name="add-circle" size={26} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default VitalSignGroup
