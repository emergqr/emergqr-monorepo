import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DataTable } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { VitalSignRead } from '@/interfaces/client/vital-sign.interface'
import { useTheme } from '@/contexts/ThemeContext'

interface VitalSignTableProps {
  data: VitalSignRead[]
}

const VitalSignTable: React.FC<VitalSignTableProps> = ({ data }) => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()

  // Ordenar por fecha, del más reciente al más antiguo
  const sortedData = data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime(),
    )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Formato: DD/MM/YY, HH:MM
    return date.toLocaleString('es-ES', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const styles = StyleSheet.create({
    cellText: {
      color: themeColors.text,
      fontSize: 13,
    },
    container: {
      borderColor: themeColors.border,
      borderRadius: 8,
      borderWidth: 1,
      marginTop: 10,
      overflow: 'hidden', // Para que el contenido respete el borde redondeado
    },
    header: {
      backgroundColor: themeColors.surface,
    },
    headerTitle: {
      color: themeColors.text,
      fontWeight: 'bold',
    },
    row: {
      backgroundColor: themeColors.card,
    },
  })

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header style={styles.header}>
          <DataTable.Title textStyle={styles.headerTitle}>
            {t('vital_sign.table.measuredAt')}
          </DataTable.Title>
          <DataTable.Title numeric textStyle={styles.headerTitle}>
            {t('vital_sign.table.value')}
          </DataTable.Title>
          <DataTable.Title numeric textStyle={styles.headerTitle}>
            {t('vital_sign.table.unit')}
          </DataTable.Title>
        </DataTable.Header>

        {sortedData.map((item) => (
          <DataTable.Row key={item.uuid} style={styles.row}>
            <DataTable.Cell>
              <Text style={styles.cellText}>
                {formatDate(item.measured_at)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.cellText}>
                {item.value_numeric ?? item.value_text}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.cellText}>{item.unit}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  )
}

export default VitalSignTable
