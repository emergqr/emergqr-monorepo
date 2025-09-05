import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { IconButton } from 'react-native-paper'

import { useTheme } from '@/contexts/ThemeContext'
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store'
import { VitalSignRead } from '@/interfaces/client/vital-sign.interface'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>

const VitalSignDashboardWidget = () => {
  const { themeColors } = useTheme()
  const { vitalSigns } = useVitalSignStore()
  const navigation = useNavigation<NavigationProp>()
  const { t } = useTranslation()

  const latestVitalSigns = useMemo(() => {
    const grouped = vitalSigns.reduce(
      (acc, record) => {
        const type = record.type
        if (
          !acc[type] ||
          new Date(record.measured_at) > new Date(acc[type].measured_at)
        ) {
          acc[type] = record
        }
        return acc
      },
      {} as Record<string, VitalSignRead>,
    )
    // Ordenar por tipo para una vista consistente
    return Object.values(grouped).sort((a, b) => a.type.localeCompare(b.type))
  }, [vitalSigns])

  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeColors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 16,
    },
    emptyText: {
      color: themeColors.secondaryText,
      paddingVertical: 16,
      textAlign: 'center',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    title: {
      color: themeColors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    vitalSignRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    vitalSignType: {
      color: themeColors.text,
      fontSize: 16,
    },
    vitalSignUnit: {
      color: themeColors.secondaryText,
      fontSize: 14,
      marginLeft: 4,
    },
    vitalSignValue: {
      color: themeColors.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    vitalSignValueContainer: {
      alignItems: 'baseline',
      flexDirection: 'row',
    },
  })

  if (vitalSigns.length === 0) {
    return null // No mostrar nada si no hay datos.
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('vital_sign.widget.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('VitalSignList')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconButton
            icon="arrow-right"
            size={24}
            iconColor={themeColors.primary}
          />
        </TouchableOpacity>
      </View>

      {latestVitalSigns.length > 0 ? (
        latestVitalSigns.map((vital) => (
          <View key={vital.uuid} style={styles.vitalSignRow}>
            <Text style={styles.vitalSignType}>
              {t(`vital_sign.types.${vital.type}`, vital.type)}
            </Text>
            <View style={styles.vitalSignValueContainer}>
              <Text style={styles.vitalSignValue}>
                {vital.value_numeric ?? vital.value_text}
              </Text>
              {vital.unit && (
                <Text style={styles.vitalSignUnit}>{vital.unit}</Text>
              )}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>{t('vital_sign.list.empty')}</Text>
      )}
    </View>
  )
}

export default VitalSignDashboardWidget
