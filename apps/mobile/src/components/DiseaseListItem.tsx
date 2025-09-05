import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/contexts/ThemeContext'
import { PatientDiseaseRead } from '@/interfaces/client/disease.interface'
import InfoCard from '@/components/InfoCard'

interface DiseaseListItemProps {
  disease: PatientDiseaseRead
  onEdit: () => void
  onDelete: () => void
}

const DiseaseListItem: React.FC<DiseaseListItemProps> = ({
  disease,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()

  // Se adapta la función para usar `is_active` (booleano) que viene de la API.
  const getStatusInfo = (isActive: boolean | null | undefined) => {
    switch (isActive) {
      case true:
        return { color: themeColors.alert, text: t('disease.status.active') }
      case false:
        // Usamos un color más neutro para condiciones inactivas.
        return {
          color: themeColors.secondaryText,
          text: t('disease.status.inactive'),
        }
      default:
        // Si el estado es null o undefined, no mostramos nada.
        return { color: themeColors.secondaryText, text: null }
    }
  }

  const statusInfo = getStatusInfo(disease.is_active)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        dateText: {
          color: themeColors.secondaryText,
          fontSize: 14,
          marginLeft: 8,
        },
        statusText: {
          color: statusInfo.color,
          fontSize: 14,
          fontWeight: '500',
        },
        subtitleContainer: {
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 4,
        },
      }),
    [themeColors, statusInfo.color],
  )

  return (
    <InfoCard
      iconName="pulse-outline"
      iconColor={statusInfo.color}
      title={disease.disease.name}
      subtitle={
        <View style={styles.subtitleContainer}>
          {statusInfo.text && (
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          )}
          {/* Se usa `diagnosis_date` en lugar de `diagnosedAt` para coincidir con la API. */}
          <Text style={styles.dateText}>
            {t('disease.diagnosed_at', { date: disease.diagnosis_date })}
          </Text>
        </View>
      }
      description={disease.notes || undefined}
      actions={[
        { icon: 'create-outline', onPress: onEdit, color: themeColors.text },
        { icon: 'trash-outline', onPress: onDelete, color: themeColors.alert },
      ]}
    />
  )
}

export default DiseaseListItem
