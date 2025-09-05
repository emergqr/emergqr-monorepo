import React, { useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useTheme } from '@/contexts/ThemeContext'
import { useEmergencyDataStore } from '@/store/emergencyData/emergencyData.store'
import { ScreenHeader } from '@emergqr/ui'
import FormInput from '@/components/forms/FormInput'
import DateTimePickerInput from '@/components/forms/DateTimePickerInput'
import SelectInput, { Option } from '@/components/forms/SelectInput'
import { EmergencyDataUpdate } from '../../../../../packages/core/src/domain/interfaces/client/emergencyData.interface'

interface EmergencyDataForm {
  bird_date?: Date
  direccion: string
  blood: string
  allergies: string[]
  diseases: string[]
  medications: string[]
  social_security_health_system: string
}

const BLOOD_TYPE_OPTIONS: Option[] = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
]

const ALLERGY_OPTIONS: Option[] = [
  { label: 'Penicilina', value: 'Penicilina' },
  { label: 'Mariscos', value: 'Mariscos' },
  { label: 'Nueces', value: 'Nueces' },
  { label: 'Látex', value: 'Látex' },
  { label: 'Soja', value: 'Soja' },
  { label: 'Huevo', value: 'Huevo' },
  { label: 'Trigo', value: 'Trigo' },
  { label: 'Polen', value: 'Polen' },
  { label: 'Ácaros del polvo', value: 'Ácaros del polvo' },
]

const DISEASE_OPTIONS: Option[] = [
  { label: 'Hipertensión', value: 'Hipertensión' },
  { label: 'Diabetes', value: 'Diabetes' },
  { label: 'Asma', value: 'Asma' },
  { label: 'Hipotiroidismo', value: 'Hipotiroidismo' },
  { label: 'Enfermedad Renal Crónica', value: 'Enfermedad Renal Crónica' },
  { label: 'Artritis', value: 'Artritis' },
  { label: 'Migraña', value: 'Migraña' },
  { label: 'Ansiedad', value: 'Ansiedad' },
]

const MEDICATION_OPTIONS: Option[] = [
  { label: 'Ibuprofeno', value: 'Ibuprofeno' },
  { label: 'Paracetamol', value: 'Paracetamol' },
  { label: 'Omeprazol', value: 'Omeprazol' },
  { label: 'Metformina', value: 'Metformina' },
  { label: 'Levotiroxina', value: 'Levotiroxina' },
  { label: 'Lisinopril', value: 'Lisinopril' },
  { label: 'Salbutamol', value: 'Salbutamol' },
]

const EmergencyDataScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation()
  const { data, isLoading, isUpdating, fetch, save, remove } =
    useEmergencyDataStore()

  const { control, handleSubmit, reset } = useForm<EmergencyDataForm>({
    defaultValues: {
      allergies: [],
      diseases: [],
      medications: [],
    },
  })

  useEffect(() => {
    fetch()
  }, [fetch])

  useEffect(() => {
    if (data) {
      reset({
        bird_date: data.bird_date ? new Date(data.bird_date) : undefined,
        direccion: data.direccion || '',
        blood: data.blood || '',
        allergies: data.allergies
          ? data.allergies
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        diseases: data.diseases
          ? data.diseases
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        medications: data.medications
          ? data.medications
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        social_security_health_system: data.social_security_health_system || '',
      })
    }
  }, [data, reset])

  const onSave = async (formData: EmergencyDataForm) => {
    const payload: EmergencyDataUpdate = {
      bird_date: formData.bird_date
        ? formData.bird_date.toISOString().split('T')[0]
        : null,
      direccion: formData.direccion || null,
      blood: formData.blood || null,
      social_security_health_system:
        formData.social_security_health_system || null,
      allergies:
        formData.allergies && formData.allergies.length > 0
          ? formData.allergies.join(',')
          : null,
      diseases:
        formData.diseases && formData.diseases.length > 0
          ? formData.diseases.join(',')
          : null,
      medications:
        formData.medications && formData.medications.length > 0
          ? formData.medications.join(',')
          : null,
    }

    try {
      await save(payload)
      Toast.show({
        type: 'success',
        text1: t('emergency_data.save_success'),
      })
      navigation.goBack()
    } catch (err: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      console.error('--- DEBUG: Error al guardar datos de emergencia ---', err)

      let message = t('errors.genericMessage')
      if (err instanceof Error) {
        message = err.message
      }

      // Lógica para intentar parsear errores de API más específicos
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response: { data?: { detail?: unknown } } })
          .response
        if (response?.data?.detail) {
          const detail = response.data.detail
          if (typeof detail === 'string') {
            message = detail
          } else if (
            Array.isArray(detail) &&
            typeof (detail[0] as { msg?: string }).msg === 'string'
          ) {
            message = (detail[0] as { msg: string }).msg
          }
        }
      }

      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const handleDelete = () => {
    Alert.alert(t('common.delete'), t('emergency_data.deleteConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await remove()
            Toast.show({
              type: 'info',
              text1: t('emergency_data.delete_success'),
            })
            navigation.goBack()
          } catch (err: unknown) {
            // Se ha cambiado a 'unknown' para un manejo de errores más seguro.
            const message =
              err instanceof Error ? err.message : t('errors.genericMessage')
            Alert.alert(t('errors.genericTitle'), message)
          }
        },
      },
    ])
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: { padding: 20, paddingBottom: 40 },
        loadingContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        },
      }),
    [themeColors],
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={t('emergency_data.title')}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('emergency_data.title')}
        onBackPress={() => navigation.goBack()}
        rightActions={[
          {
            icon: 'trash-outline',
            onPress: handleDelete,
            color: themeColors.alert,
            disabled: isUpdating || !data, // Se deshabilita si no hay datos
            tooltip: t('tooltips.deleteData'),
          },
          {
            icon: 'save-outline',
            onPress: handleSubmit(onSave),
            disabled: isUpdating,
            tooltip: t('tooltips.saveChanges'),
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isUpdating && (
          <ActivityIndicator
            size="small"
            color={themeColors.primary}
            style={{ alignSelf: 'center', marginBottom: 10 }}
          />
        )}
        <DateTimePickerInput
          control={control}
          name="bird_date"
          label={t('emergency_data.birth_date')}
          placeholder={t('emergency_data.birth_date_placeholder')}
        />
        <Controller
          control={control}
          name="direccion"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label={t('emergency_data.address')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value as string}
              placeholder={t('emergency_data.address_placeholder')}
              editable={!isUpdating}
            />
          )}
        />
        <SelectInput
          control={control}
          name="blood"
          label={t('emergency_data.blood_type')}
          placeholder={t('emergency_data.blood_type_placeholder')}
          options={BLOOD_TYPE_OPTIONS}
          dialogTitle={t('emergency_data.blood_type_dialog_title')}
        />
        <SelectInput
          control={control}
          name="allergies"
          label={t('emergency_data.allergies')}
          placeholder={t('emergency_data.allergies_placeholder')}
          options={ALLERGY_OPTIONS}
          multiSelect
          dialogTitle={t('emergency_data.allergies_dialog_title')}
        />
        <SelectInput
          control={control}
          name="diseases"
          label={t('emergency_data.diseases')}
          placeholder={t('emergency_data.diseases_placeholder')}
          options={DISEASE_OPTIONS}
          multiSelect
          dialogTitle={t('emergency_data.diseases_dialog_title')}
        />
        <SelectInput
          control={control}
          name="medications"
          label={t('emergency_data.medications')}
          placeholder={t('emergency_data.medications_placeholder')}
          options={MEDICATION_OPTIONS}
          multiSelect
          dialogTitle={t('emergency_data.medications_dialog_title')}
        />
        <Controller
          control={control}
          name="social_security_health_system"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label={t('emergency_data.sshs')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value as string}
              placeholder={t('emergency_data.sshs_placeholder')}
              editable={!isUpdating}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default EmergencyDataScreen
