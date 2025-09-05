import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {
  Text,
  TextInput,
  ActivityIndicator,
  HelperText,
  Chip,
} from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import * as DocumentPicker from 'expo-document-picker'
import { DatePickerInput } from 'react-native-paper-dates'

import { useTheme } from '@/contexts/ThemeContext'
import { useMedicalHistoryStore } from '@/store/medical-history/medical-history.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import { ScreenHeader, ScreenWrapper } from '@emergqr/ui'
import { MedicalEventType } from '../../../../../packages/core/src/domain/interfaces/client/medical-history.interface'
import { useSnackbar } from '@/hooks/useSnackbar'

// Define los tipos de eventos médicos como un array de strings literal para Zod y TypeScript.
const medicalEventTypes = [
  'surgery',
  'imaging',
  'lab',
  'treatment',
  'appointment',
  'cosmetic',
  'other',
] as const

const medicalEventSchemaBase = z.object({
  title: z.string(),
  event_type: z.enum(medicalEventTypes),
  event_date: z.date(),
  description: z.string().nullish(),
  location: z.string().nullish(),
  doctor_name: z.string().nullish(),
})

type MedicalEventFormData = z.infer<typeof medicalEventSchemaBase>
type MedicalEventFormRouteProp = RouteProp<
  ProfileStackParamList,
  'MedicalEventForm'
>

const MedicalEventFormScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation()
  const { showSnackbar } = useSnackbar()
  const route = useRoute<MedicalEventFormRouteProp>()
  const eventUuid = route.params?.eventUuid
  const isEditMode = !!eventUuid

  const { events, addMedicalEvent, editMedicalEvent, loading } =
    useMedicalHistoryStore()
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const medicalEventSchema = useMemo(
    () =>
      z.object({
        title: z
          .string()
          .min(3, t('medical_history.validation.title_required')),
        event_type: z.enum(medicalEventTypes, {
          required_error: t('medical_history.validation.type_required'),
        }),
        event_date: z.date({
          required_error: t('medical_history.validation.date_required'),
        }),
        description: z.string().nullish(),
        location: z.string().nullish(),
        doctor_name: z.string().nullish(),
      }),
    [t],
  )

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicalEventFormData>({
    resolver: zodResolver(medicalEventSchema),
  })

  useEffect(() => {
    if (isEditMode) {
      const eventToEdit = events.find((e) => e.uuid === eventUuid)
      if (eventToEdit) {
        const eventTypeKey = medicalEventTypes.find(
          (key) =>
            t(`medical_history.event_types.${key}`) === eventToEdit.event_type,
        )

        reset({
          title: eventToEdit.title,
          event_type: eventTypeKey || 'other',
          event_date: new Date(eventToEdit.event_date),
          description: eventToEdit.description,
          location: eventToEdit.location,
          doctor_name: eventToEdit.doctor_name,
        })
      }
    }
  }, [eventUuid, isEditMode, events, reset, t]) // Se ha añadido 't' a las dependencias

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      })
      if (!result.canceled) {
        setFiles((prevFiles) => [...prevFiles, ...result.assets])
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudieron seleccionar los archivos.')
    }
  }

  const onSubmit = async (data: MedicalEventFormData) => {
    setFormError(null)
    try {
      const payload = {
        ...data,
        event_date: data.event_date.toISOString(),
        event_type: t(
          `medical_history.event_types.${data.event_type}`,
        ) as MedicalEventType,
      }

      if (isEditMode) {
        await editMedicalEvent(eventUuid, payload)
      } else {
        await addMedicalEvent(payload, files)
      }
      showSnackbar(t('medical_history.save_success'))
      navigation.goBack()
    } catch (error: unknown) {
      // Se ha cambiado a 'unknown' para un manejo de errores más seguro.
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('medical_history.error_saving')
      setFormError(errorMessage)
    }
  }

  // Se ha añadido un tipo más específico para las props del TextInput
  const renderFormInput = (
    name: keyof MedicalEventFormData,
    label: string,
    props: Partial<React.ComponentProps<typeof TextInput>> = {},
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          label={label}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value as string}
          error={!!errors[name]}
          style={styles.input}
          {...props}
        />
      )}
    />
  )

  const styles = useMemo(
    () =>
      StyleSheet.create({
        chip: { marginBottom: 8, marginRight: 8 },
        chipContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 16,
        },
        container: { padding: 16, paddingBottom: 40 },
        input: { backgroundColor: 'transparent', marginBottom: 16 },
        label: {
          color: themeColors.onSurfaceVariant,
          fontSize: 16,
          marginBottom: 8,
        },
        title: {
          color: themeColors.primary,
          marginBottom: 24,
          textAlign: 'center',
        },
      }),
    [themeColors],
  )

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={
          isEditMode
            ? t('medical_history.edit_event')
            : t('medical_history.add_event')
        }
        onBackPress={() => navigation.goBack()}
        rightActions={[
          {
            icon: 'attach-outline',
            onPress: pickDocument,
            disabled: loading || isEditMode,
            tooltip: t('medical_history.attach_files'),
          },
          {
            icon: 'save-outline',
            onPress: handleSubmit(onSubmit),
            disabled: loading,
            tooltip: t('tooltips.saveChanges'),
          },
        ]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {loading && (
            <ActivityIndicator
              animating={true}
              color={themeColors.primary}
              style={{ marginBottom: 16 }}
            />
          )}

          {renderFormInput('title', t('medical_history.form.title_label'))}
          {errors.title && (
            <HelperText type="error" visible>
              {errors.title.message}
            </HelperText>
          )}

          <View style={styles.input}>
            <Text variant="bodyLarge" style={styles.label}>
              {t('medical_history.form.type_label')}
            </Text>
            <View style={styles.chipContainer}>
              {medicalEventTypes.map((type) => (
                <Chip
                  key={type}
                  selected={watch('event_type') === type}
                  onPress={() =>
                    setValue('event_type', type, { shouldValidate: true })
                  }
                  style={styles.chip}
                >
                  {t(`medical_history.event_types.${type}`)}
                </Chip>
              ))}
            </View>
            {errors.event_type && (
              <HelperText type="error" visible>
                {errors.event_type.message}
              </HelperText>
            )}
          </View>

          <Controller
            control={control}
            name="event_date"
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                locale={t('locale_code')}
                label={t('medical_history.form.date_label')}
                value={value}
                onChange={(d) => onChange(d)}
                inputMode="start"
                style={styles.input}
              />
            )}
          />
          {errors.event_date && (
            <HelperText type="error" visible>
              {errors.event_date.message}
            </HelperText>
          )}

          {renderFormInput(
            'description',
            t('medical_history.form.description_label'),
            { multiline: true, numberOfLines: 4 },
          )}
          {renderFormInput(
            'location',
            t('medical_history.form.location_label'),
          )}
          {renderFormInput(
            'doctor_name',
            t('medical_history.form.doctor_name_label'),
          )}

          <View style={styles.chipContainer}>
            {files.map((file, index) => (
              <Chip
                key={index}
                icon="file"
                style={styles.chip}
                onClose={() =>
                  setFiles(files.filter((f) => f.uri !== file.uri))
                }
              >
                {file.name}
              </Chip>
            ))}
          </View>

          {formError && (
            <HelperText type="error" visible={!!formError}>
              {formError}
            </HelperText>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default MedicalEventFormScreen
