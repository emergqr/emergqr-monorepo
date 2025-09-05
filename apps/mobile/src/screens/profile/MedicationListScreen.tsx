import React, { useCallback } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Button, Card, Paragraph, Text, Title } from 'react-native-paper'

import { useMedicationStore } from '@/store/medication/medication.store'
import { MedicationScheduleRead } from '../../../../../packages/core/src/domain/interfaces/client/medication.interface'

// Se recomienda centralizar los tipos de navegación en un archivo dedicado
type MedicationListNavigationProp = {
  navigate: (
    screen: 'MedicationForm',
    params?: { scheduleId: string | null },
  ) => void
  addListener: (event: 'focus', callback: () => void) => () => void
}

/**
 * Componente para renderizar un ítem individual en la lista de medicaciones.
 */
const MedicationListItem = ({
  item,
  onPress,
}: {
  item: MedicationScheduleRead
  onPress: () => void
}) => {
  const { t } = useTranslation()

  const getFrequencyInfo = (schedule: MedicationScheduleRead) => {
    if (schedule.reminders.length > 0) {
      const reminderTimes = schedule.reminders.map((r) => r.time).join(', ')
      return `${t('medication.reminders_at')}: ${reminderTimes}`
    }
    return `${t('medication.frequency')}: ${t(
      `medication.frequency_options.${schedule.frequency}`,
    )}`
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.medicationName}</Title>
          <Paragraph>{`${t('medication.dosage')}: ${item.dosage}`}</Paragraph>
          <Paragraph style={styles.frequencyInfo}>
            {getFrequencyInfo(item)}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

/**
 * Pantalla que muestra la lista de planes de medicación del usuario.
 */
export const MedicationListScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<MedicationListNavigationProp>()
  const { schedules, loading, error, fetchSchedules } = useMedicationStore()

  // useFocusEffect es ideal para recargar datos cada vez que la pantalla obtiene foco.
  useFocusEffect(
    useCallback(() => {
      fetchSchedules()
    }, [fetchSchedules]),
  )

  const handleAddMedication = () => {
    navigation.navigate('MedicationForm', { scheduleId: null })
  }

  const handleEditMedication = (scheduleId: string) => {
    navigation.navigate('MedicationForm', { scheduleId })
  }

  if (loading && schedules.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('errors.generic_fetch_error')}</Text>
        <Button onPress={() => fetchSchedules()}>{t('common.retry')}</Button>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <MedicationListItem
            item={item}
            onPress={() => handleEditMedication(item.uuid)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {t('medication.no_schedules_found')}
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={schedules.length === 0 ? styles.flexGrow : null}
        refreshing={loading}
        onRefresh={fetchSchedules}
      />
      <Button
        icon="plus"
        mode="contained"
        onPress={handleAddMedication}
        style={styles.fab}
      >
        {t('medication.add_medication')}
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 8 },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: { flex: 1 },
  emptyText: { color: '#666', textAlign: 'center' },
  errorText: { color: 'red', marginBottom: 16, textAlign: 'center' },
  fab: { bottom: 0, margin: 16, position: 'absolute', right: 0 },
  flexGrow: { flexGrow: 1 },
  frequencyInfo: { color: '#666', fontSize: 12, marginTop: 4 },
})
