import React, { useEffect } from 'react'
import { View, FlatList, StyleSheet, Alert } from 'react-native'
import { ActivityIndicator, Text, Card, IconButton } from 'react-native-paper'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useMedicalHistoryStore } from '@/store/medical-history/medical-history.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@/contexts/ThemeContext'
import { MedicalEventRead } from '@/interfaces/client/medical-history.interface'
import { ScreenHeader, ScreenWrapper } from '@emergqr/ui'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSnackbar } from '@/hooks/useSnackbar'

type MedicalHistoryNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'MedicalHistory'
>

const MedicalHistoryScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<MedicalHistoryNavigationProp>()
  const { themeColors } = useTheme()
  const isFocused = useIsFocused()
  const { showSnackbar } = useSnackbar()

  const { events, loading, error, fetchMedicalHistory, removeMedicalEvent } =
    useMedicalHistoryStore()

  useEffect(() => {
    if (isFocused) {
      fetchMedicalHistory()
    }
  }, [isFocused, fetchMedicalHistory])

  const handleAddEvent = () => {
    navigation.navigate('MedicalEventForm')
  }

  const handleEditEvent = (eventUuid: string) => {
    navigation.navigate('MedicalEventForm', { eventUuid })
  }

  const handleDeleteEvent = (event: MedicalEventRead) => {
    Alert.alert(
      `Eliminar "${event.title}"`,
      '¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMedicalEvent(event.uuid)
              showSnackbar(t('medical_history.delete_success'))
            } catch (e) {
              // El error ya se maneja y muestra en el store/hook de snackbar
            }
          },
        },
      ],
    )
  }

  const renderItem = ({ item }: { item: MedicalEventRead }) => (
    <Card style={styles.card} onPress={() => handleEditEvent(item.uuid)}>
      <Card.Title
        title={item.title}
        subtitle={`${item.event_type} - ${format(new Date(item.event_date), 'dd MMM yyyy', { locale: es })}`}
        titleStyle={{ color: themeColors.primary }}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => handleDeleteEvent(item)}
            iconColor={themeColors.alert}
          />
        )}
      />
      {item.description && (
        <Card.Content>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
      )}
    </Card>
  )

  if (loading && events.length === 0) {
    return (
      <ActivityIndicator
        animating={true}
        size="large"
        style={styles.centered}
      />
    )
  }

  if (error && events.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>{t('medical_history.error_fetching')}</Text>
      </View>
    )
  }

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={t('medical_history.title')}
        onBackPress={() => navigation.goBack()}
        rightActions={[
          {
            icon: 'add-outline',
            onPress: handleAddEvent,
            tooltip: t('medical_history.add_event'),
            accessibilityLabel: t('medical_history.add_event'),
          },
        ]}
      />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>{t('medical_history.no_events')}</Text>
          </View>
        }
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 8 },
  centered: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  listContent: { flexGrow: 1, paddingBottom: 80 },
})

export default MedicalHistoryScreen
