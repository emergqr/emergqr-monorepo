import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import { View, Dimensions, StyleSheet, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { VitalSignRead } from '@/interfaces/client/vital-sign.interface'
import { useTranslation } from 'react-i18next'

interface VitalSignChartProps {
  data: VitalSignRead[]
  height?: number
}

const VitalSignChart: React.FC<VitalSignChartProps> = ({
  data,
  height = 120,
}) => {
  const { themeColors } = useTheme()
  const { t } = useTranslation()

  // Ordenamos los datos por fecha y extraemos los valores numéricos
  const sortedData = data
    .slice() // Creamos una copia para no mutar el original
    .sort(
      (a, b) =>
        new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime(),
    )
    .filter(
      (item): item is VitalSignRead & { value_numeric: number } =>
        item.value_numeric !== null,
    ) // Filtramos nulos y aseguramos el tipo

  if (sortedData.length < 2) {
    return null // No se puede dibujar una línea con menos de dos puntos.
  }

  const chartValues = sortedData.map((item) => item.value_numeric)
  const latestValue = chartValues[chartValues.length - 1]
  const minValue = Math.min(...chartValues)
  const maxValue = Math.max(...chartValues)

  const getChartLabels = () => {
    if (sortedData.length === 0) return []

    // Formatea las fechas a "DD/MM"
    const labels = sortedData.map((item) => {
      const date = new Date(item.measured_at)
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
    })

    // Si hay pocas etiquetas, las mostramos todas.
    if (labels.length <= 5) {
      return labels
    }

    // Si hay muchas, mostramos solo la primera y la última para evitar que se solapen.
    const first = labels[0]
    const last = labels[labels.length - 1]
    const sparseLabels = Array(labels.length).fill('')
    sparseLabels[0] = first
    sparseLabels[labels.length - 1] = last
    return sparseLabels
  }

  const chartConfig = {
    backgroundColor: themeColors.card,
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    decimalPlaces: sortedData[0]?.unit === 'count' ? 0 : 1, // Sin decimales para conteos
    color: () => themeColors.primary, // Se eliminó el parámetro `opacity` no utilizado
    labelColor: () => themeColors.secondaryText, // Se eliminó el parámetro `opacity` no utilizado
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '2',
      strokeWidth: '1',
      stroke: themeColors.primary,
    },
  }

  const chartKitData = {
    labels: getChartLabels(),
    datasets: [
      {
        data: chartValues,
        color: () => themeColors.primary, // Se eliminó el parámetro `opacity` no utilizado
        strokeWidth: 1,
      },
    ],
  }

  const styles = StyleSheet.create({
    chart: {
      borderRadius: 16,
    },
    container: {
      alignItems: 'center',
      marginTop: 10,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 8,
      width: '100%',
    },
    legendItem: {
      color: themeColors.secondaryText,
      fontSize: 12,
    },
  })

  return (
    <View style={styles.container}>
      <LineChart
        data={chartKitData}
        width={Dimensions.get('window').width - 64} // Ajustamos al padding del componente padre
        height={height}
        chartConfig={chartConfig}
        bezier
        withHorizontalLabels={true}
        withVerticalLabels={true}
        withInnerLines={false}
        withOuterLines={false}
        withShadow={false}
        style={styles.chart}
      />
      <View style={styles.legendContainer}>
        <Text
          style={styles.legendItem}
        >{`${t('vital_sign.chart.min')}: ${minValue}`}</Text>
        <Text
          style={styles.legendItem}
        >{`${t('vital_sign.chart.latest')}: ${latestValue}`}</Text>
        <Text
          style={styles.legendItem}
        >{`${t('vital_sign.chart.max')}: ${maxValue}`}</Text>
      </View>
    </View>
  )
}

export default VitalSignChart
