import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Appbar, Button, HelperText, Text, TextInput } from 'react-native-paper'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { format, parseISO } from 'date-fns'

import { useMedicationStore } from '@/store/medication/medication.store'
import { useTheme } from '@/contexts/ThemeContext'

const medicationSchema = z
  .object({
    medicationName: z.string().min(1, 'medication.validation.name_required'),
    dosage: z.string().min(1, 'medication.validation.dosage_required'),
    frequency: z.enum(['daily', 'weekly', 'custom']),
    startDate: z.date({
      required_error: 'medication.validation.start_date_required',
    }),
    endDate: z.date().optional().nullable(),
    timeSlots: z.array(z.string().regex(/^\d{2}:\d{2}$/)),
    notes: z.string().optional(),
  })
  .refine((data) => data.timeSlots.length > 0, {
    message: 'medication.validation.time_slot_required',
    path: ['timeSlots'], // Asocia el error al campo timeSlots
  })

type MedicationFormData = z.infer<typeof medicationSchema>

type RouteParams = {
  scheduleId?: string
}

export const MedicationFormScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const { scheduleId } = (route.params as RouteParams) || {}
  const isEditMode = !!scheduleId

  const { themeColors } = useTheme()
  const { schedules, addSchedule, updateSchedule, deleteSchedule, loading } =
    useMedicationStore()

  const [showDatePicker, setShowDatePicker] = useState<
    'start' | 'end' | 'time' | null
  >(null)
  const [timePickerIndex, setTimePickerIndex] = useState(0)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      frequency: 'daily',
      timeSlots: ['08:00'],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeSlots',
  })

  useEffect(() => {
    if (isEditMode) {
      const scheduleToEdit = schedules.find((s) => s.uuid === scheduleId)
      if (scheduleToEdit) {
        setValue('medicationName', scheduleToEdit.medicationName)
        setValue('dosage', scheduleToEdit.dosage)
        setValue('frequency', scheduleToEdit.frequency)
        setValue('startDate', parseISO(scheduleToEdit.startDate))
        setValue(
          'endDate',
          scheduleToEdit.endDate ? parseISO(scheduleToEdit.endDate) : null,
        )
        setValue(
          'timeSlots',
          scheduleToEdit.reminders.map((r) => r.time),
        )
        setValue('notes', scheduleToEdit.notes || '')
      }
    }
  }, [scheduleId, schedules, setValue, isEditMode])

  const onSubmit = async (data: MedicationFormData) => {
    const payload = {
      ...data,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: data.endDate ? format(data.endDate, 'yyyy-MM-dd') : null,
    }

    try {
      if (isEditMode) {
        await updateSchedule(scheduleId, payload)
      } else {
        await addSchedule(payload)
      }
      navigation.goBack()
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t('errors.genericMessage')
      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const handleDelete = () => {
    Alert.alert(t('medication.delete_title'), t('medication.delete_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSchedule(scheduleId!)
            navigation.goBack()
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : t('errors.genericMessage')
            Alert.alert(t('errors.genericTitle'), message)
          }
        },
      },
    ])
  }

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(null)
    if (selectedDate) {
      if (showDatePicker === 'start') setValue('startDate', selectedDate)
      if (showDatePicker === 'end') setValue('endDate', selectedDate)
    }
  }

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowDatePicker(null)
    if (selectedTime) {
      const formattedTime = format(selectedTime, 'HH:mm')
      const newTimes = [...watch('timeSlots')]
      newTimes[timePickerIndex] = formattedTime
      setValue('timeSlots', newTimes)
    }
  }

  const styles = StyleSheet.create({
    container: { backgroundColor: themeColors.background, flex: 1 },
    content: { padding: 20 },
    dateContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    deleteButton: { marginTop: 20 },
    input: { marginBottom: 16 },
    label: {
      color: themeColors.text,
      fontSize: 16,
      marginBottom: 8,
    },
    radioGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    timeSlotContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    timeText: { color: themeColors.text, fontSize: 18 },
  })

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            isEditMode ? t('medication.edit_title') : t('medication.add_title')
          }
        />
        {isEditMode && <Appbar.Action icon="delete" onPress={handleDelete} />}
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Controller
          control={control}
          name="medicationName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('medication.form.name_label')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.medicationName}
            />
          )}
        />
        {errors.medicationName?.message && (
          <HelperText type="error">
            {t(errors.medicationName.message)}
          </HelperText>
        )}

        {/* ... otros campos como Dosis, Frecuencia, Fechas ... */}

        <Text style={styles.label}>{t('medication.form.reminders_label')}</Text>
        {fields.map((field, index) => (
          <View key={field.id} style={styles.timeSlotContainer}>
            <TouchableOpacity
              onPress={() => {
                setTimePickerIndex(index)
                setShowDatePicker('time')
              }}
            >
              <Text style={styles.timeText}>{watch('timeSlots')[index]}</Text>
            </TouchableOpacity>
            {fields.length > 1 && (
              <Button icon="minus-circle-outline" onPress={() => remove(index)}>
                {t('common.delete')}
              </Button>
            )}
          </View>
        ))}
        <Button icon="plus" onPress={() => append('12:00')}>
          {t('medication.form.add_time')}
        </Button>
        {errors.timeSlots?.message && (
          <HelperText type="error">{t(errors.timeSlots.message)}</HelperText>
        )}

        {/* ... campo de Notas ... */}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={{ marginTop: 24 }}
        >
          {t('common.save')}
        </Button>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={
            showDatePicker === 'start'
              ? watch('startDate') || new Date()
              : showDatePicker === 'end'
                ? watch('endDate') || new Date()
                : new Date()
          }
          mode={showDatePicker === 'time' ? 'time' : 'date'}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={showDatePicker === 'time' ? onTimeChange : onDateChange}
        />
      )}
    </View>
  )
}

export default MedicationFormScreen
