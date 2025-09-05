import React, { useEffect, useMemo } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

import { useTheme } from '@/contexts/ThemeContext'
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import ScreenHeader from '@/components/ScreenHeader'
import FormInput from '@/components/forms/FormInput'
import SelectInput, { Option } from '@/components/forms/SelectInput'
import ChecklistItem from '@/components/forms/ChecklistItem'
import {
  VitalSignCreate,
  VitalSignUpdate,
  VitalSignType,
} from '@/interfaces/client/vital-sign.interface'
import DateTimePickerInput from '@/components/forms/DateTimePickerInput'

const getVitalSignSchema = (t: (key: string) => string) =>
  z.object({
    type: z.string().min(1, t('errors.validation.required')),
    value_numeric: z
      .number({ invalid_type_error: t('errors.validation.numeric') })
      .nullable(),
    value_secondary: z
      .number({ invalid_type_error: t('errors.validation.numeric') })
      .nullable(),
    unit: z.string().nullable(),
    measured_at: z.date(),
    notes: z.string().nullable(),
    show_in_emergency: z.boolean(),
  })

type VitalSignFormData = z.infer<ReturnType<typeof getVitalSignSchema>>
type VitalSignFormRouteProp = RouteProp<ProfileStackParamList, 'VitalSignForm'>

const VitalSignFormScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation()
  const route = useRoute<VitalSignFormRouteProp>()

  const { vitalSignUuid, type: preselectedType } = route.params || {}
  const isEditMode = !!vitalSignUuid

  // Se han eliminado `loading` y `error` porque no se estaban utilizando.
  const {
    vitalSigns,
    types,
    fetchVitalSignTypes,
    addVitalSign,
    editVitalSign,
  } = useVitalSignStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VitalSignFormData>({
    resolver: zodResolver(getVitalSignSchema(t)),
    defaultValues: {
      type: preselectedType || '',
      value_numeric: null,
      value_secondary: null,
      unit: null,
      measured_at: new Date(),
      notes: null,
      show_in_emergency: true,
    },
  })

  const watchedType = useWatch({ control, name: 'type' })

  useEffect(() => {
    fetchVitalSignTypes()
  }, [fetchVitalSignTypes])

  useEffect(() => {
    if (isEditMode && vitalSignUuid) {
      const signToEdit = vitalSigns.find((s) => s.uuid === vitalSignUuid)
      if (signToEdit) {
        reset({
          type: signToEdit.type,
          value_numeric: signToEdit.value_numeric,
          value_secondary: signToEdit.value_secondary,
          unit: signToEdit.unit,
          measured_at: new Date(signToEdit.measured_at),
          notes: signToEdit.notes,
          show_in_emergency: signToEdit.show_in_emergency,
        })
      }
    }
  }, [isEditMode, vitalSignUuid, vitalSigns, reset])

  const onSave = async (data: VitalSignFormData) => {
    try {
      const commonPayload = {
        value_numeric: data.value_numeric,
        value_secondary: data.value_secondary,
        unit: data.unit,
        measured_at: data.measured_at.toISOString(),
        notes: data.notes,
        show_in_emergency: data.show_in_emergency,
        value_text: null,
        device_name: null,
        is_manual: true,
      }

      if (isEditMode && vitalSignUuid) {
        const payload: VitalSignUpdate = commonPayload
        await editVitalSign(vitalSignUuid, payload)
        Toast.show({ type: 'success', text1: t('vital_sign.successEdit') })
      } else {
        const payload: VitalSignCreate = {
          ...commonPayload,
          type: data.type as VitalSignType,
        }
        await addVitalSign(payload)
        Toast.show({ type: 'success', text1: t('vital_sign.successAdd') })
      }
      navigation.goBack()
    } catch (err: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        err instanceof Error ? err.message : t('errors.genericMessage')
      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const typeOptions: Option[] = useMemo(
    () => types.map((type) => ({ label: type, value: type })),
    [types],
  )

  const styles = StyleSheet.create({
    container: { backgroundColor: themeColors.background, flex: 1 },
    content: { padding: 20 },
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={isEditMode ? t('vital_sign.edit') : t('vital_sign.add')}
        canGoBack
        rightActions={[
          {
            icon: 'save-outline',
            onPress: handleSubmit(onSave),
            disabled: isSubmitting,
            tooltip: t('tooltips.saveChanges'),
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isSubmitting && <ActivityIndicator />}
        <SelectInput
          control={control}
          name="type"
          label={t('vital_sign.typeLabel')}
          placeholder={t('vital_sign.typePlaceholder')}
          options={typeOptions}
          dialogTitle={t('vital_sign.title')}
          disabled={isEditMode}
        />

        <Controller
          control={control}
          name="value_numeric"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label={
                watchedType === 'Blood Pressure'
                  ? t('vital_sign.valueLabel') + ' (Sistólica)'
                  : t('vital_sign.valueLabel')
              }
              placeholder={t('vital_sign.valuePlaceholder')}
              onBlur={onBlur}
              onChangeText={(text) => onChange(text ? Number(text) : null)}
              value={value?.toString() ?? ''}
              error={errors.value_numeric?.message}
              keyboardType="numeric"
            />
          )}
        />

        {watchedType === 'Blood Pressure' && (
          <Controller
            control={control}
            name="value_secondary"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('vital_sign.secondaryValueLabel')}
                placeholder={t('vital_sign.secondaryValuePlaceholder')}
                onBlur={onBlur}
                onChangeText={(text) => onChange(text ? Number(text) : null)}
                value={value?.toString() ?? ''}
                error={errors.value_secondary?.message}
                keyboardType="numeric"
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="unit"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label={t('vital_sign.unitLabel')}
              placeholder={t('vital_sign.unitPlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              error={errors.unit?.message}
            />
          )}
        />

        <DateTimePickerInput
          control={control}
          name="measured_at"
          label={t('vital_sign.measuredAtLabel')}
          mode="datetime"
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label={t('common.notes')}
              placeholder={t('vital_sign.notesPlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ?? ''}
              error={errors.notes?.message}
              multiline
            />
          )}
        />

        <Controller
          control={control}
          name="show_in_emergency"
          render={({ field: { onChange, value } }) => (
            <ChecklistItem
              labelChecked={t('disease.showInEmergency.show')}
              labelUnchecked={t('disease.showInEmergency.hide')}
              isChecked={value}
              onPress={() => onChange(!value)}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default VitalSignFormScreen
