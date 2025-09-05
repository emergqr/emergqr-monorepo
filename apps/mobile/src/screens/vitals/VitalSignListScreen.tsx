import React, { useCallback, useMemo, useState } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { Card } from 'react-native-paper'

import { useTheme } from '@/contexts/ThemeContext'
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import { ScreenHeader } from '@emergqr/ui'
import { VitalSignRead } from '@/interfaces/client/vital-sign.interface'
import VitalSignChart from '@/components/vitals/VitalSignChart'
import VitalSignTable from '@/components/vitals/VitalSignTable'

type NavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'VitalSignList'
>

const VitalSignListScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation<NavigationProp>()
  const {
    vitalSigns,
    loading: isLoading,
    error,
    fetchMyVitalSigns,
  } = useVitalSignStore()

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')

  useFocusEffect(
    useCallback(() => {
      fetchMyVitalSigns()
    }, [fetchMyVitalSigns]),
  )

  // Lógica para agrupar los signos vitales por tipo
  const groupedVitalSigns = useMemo(() => {
    return vitalSigns.reduce(
      (acc, record) => {
        const type = record.type
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(record)
        return acc
      },
      {} as Record<string, VitalSignRead[]>,
    )
  }, [vitalSigns])

  const groupKeys = Object.keys(groupedVitalSigns)

  const styles = StyleSheet.create({
    card: {
      backgroundColor: themeColors.card,
      marginBottom: 20,
    },
    cardTitle: {
      color: themeColors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    centeredContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    container: { backgroundColor: themeColors.background, flex: 1 },
    emptyText: { color: themeColors.secondaryText, fontSize: 16 },
    errorText: { color: themeColors.alert, fontSize: 16 },
    listContent: { padding: 16, paddingBottom: 40 },
  })

  const renderContent = () => {
    if (isLoading && vitalSigns.length === 0) {
      return (
        <ActivityIndicator
          style={styles.centeredContainer}
          size="large"
          color={themeColors.primary}
        />
      )
    }
    if (error) {
      return (
        <Text style={[styles.centeredContainer, styles.errorText]}>
          {error}
        </Text>
      )
    }
    if (groupKeys.length === 0) {
      return (
        <Text style={[styles.centeredContainer, styles.emptyText]}>
          {t('vital_sign.list.empty')}
        </Text>
      )
    }

    return (
      <FlatList
        data={groupKeys}
        keyExtractor={(item) => item}
        renderItem={({ item: type }) => {
          const records = groupedVitalSigns[type]
          return (
            <Card key={type} style={styles.card}>
              <Card.Title
                title={t(`vital_sign.types.${type}`, type)}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                {viewMode === 'chart' ? (
                  <VitalSignChart data={records} />
                ) : (
                  <VitalSignTable data={records} />
                )}
              </Card.Content>
            </Card>
          )
        }}
        contentContainerStyle={styles.listContent}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('vital_sign.title')}
        onBackPress={() => navigation.goBack()}
        rightActions={[
          {
            icon: viewMode === 'chart' ? 'grid-outline' : 'stats-chart-outline',
            onPress: () =>
              setViewMode((prev) => (prev === 'chart' ? 'table' : 'chart')),
            tooltip:
              viewMode === 'chart'
                ? t('vital_sign.viewAsTable')
                : t('vital_sign.viewAsChart'),
            disabled: groupKeys.length === 0,
          },
          {
            icon: 'add-outline',
            onPress: () => navigation.navigate('VitalSignForm', {}),
            tooltip: t('vital_sign.add'),
          },
        ]}
      />
      {renderContent()}
    </SafeAreaView>
  )
}

export default VitalSignListScreen
