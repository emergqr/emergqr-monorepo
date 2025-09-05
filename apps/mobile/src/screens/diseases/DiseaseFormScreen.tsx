import React, { useEffect, useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { SegmentedButtons, Text as PaperText } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Toast from 'react-native-toast-message'

import { useTheme } from '@/contexts/ThemeContext'
import { useDiseaseStore } from '@/store/disease/disease.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import ScreenHeader from '@/components/ScreenHeader'
import {
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/disease.interface'
import { formatDateForApi } from '@/utils/dateFormatter'
import DateTimePickerInput from '@/components/forms/DateTimePickerInput'
import SelectInput, { Option } from '@/components/forms/SelectInput'
import ChecklistItem from '@/components/forms/ChecklistItem'
import FormInput from '@/components/forms/FormInput'

// Schema para la validación del formulario
const getDiseaseSchema = (t: (key: string) => string) =>
  z.object({
    disease_uuid: z.string().uuid(t('disease.validation.uuidRequired')),
    diagnosis_date: z.date({
      required_error: t('disease.validation.dateRequired'),
    }),
    severity: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    is_active: z.boolean(),
    show_in_emergency: z.boolean(),
  })

type DiseaseFormData = z.infer<ReturnType<typeof getDiseaseSchema>>

type DiseaseFormScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'DiseaseForm'
>

const DiseaseFormScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const route = useRoute<DiseaseFormScreenRouteProp>()

  const associationUuid = route.params?.associationUuid
  const isEditMode = !!associationUuid

  const severityOptions = [
    { value: 'mild', label: t('disease.severity.mild') },
    { value: 'moderate', label: t('disease.severity.moderate') },
    { value: 'severe', label: t('disease.severity.severe') },
  ]

  const {
    diseases,
    addDisease,
    editDisease,
    loading,
    masterList,
    fetchMasterList,
    masterListLoading,
  } = useDiseaseStore()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<DiseaseFormData>({
    resolver: zodResolver(getDiseaseSchema(t)),
    defaultValues: {
      disease_uuid: '',
      diagnosis_date: new Date(),
      severity: '',
      notes: '',
      is_active: true,
      show_in_emergency: true, // Por defecto, mostrar en emergencias
    },
  })

  const [diseaseName, setDiseaseName] = useState('')

  // Carga la lista maestra de enfermedades al montar la pantalla
  useEffect(() => {
    if (!isEditMode) {
      fetchMasterList()
    }
  }, [isEditMode, fetchMasterList])

  const diseaseOptions: Option[] = useMemo(
    () => masterList.map((d) => ({ label: d.name, value: d.uuid })),
    [masterList],
  )

  useEffect(() => {
    if (isEditMode) {
      const diseaseToEdit = diseases.find((d) => d.uuid === associationUuid)
      if (diseaseToEdit) {
        setDiseaseName(diseaseToEdit.disease.name)
        setValue('disease_uuid', diseaseToEdit.disease.uuid)
        setValue('diagnosis_date', new Date(diseaseToEdit.diagnosis_date))
        setValue('severity', diseaseToEdit.severity || '')
        setValue('notes', diseaseToEdit.notes || '')
        setValue('is_active', diseaseToEdit.is_active)
        setValue('show_in_emergency', diseaseToEdit.show_in_emergency ?? true)
      }
    }
  }, [isEditMode, associationUuid, diseases, setValue])

  const handleSave = async (data: DiseaseFormData) => {
    try {
      if (isEditMode && associationUuid) {
        // Se ha eliminado la desestructuración que creaba una variable no utilizada.
        const updatePayload: PatientDiseaseUpdate = {
          diagnosis_date: formatDateForApi(new Date(data.diagnosis_date)),
          severity: data.severity,
          notes: data.notes,
          is_active: data.is_active,
          show_in_emergency: data.show_in_emergency,
        }
        await editDisease(associationUuid, updatePayload)
        Toast.show({ type: 'success', text1: t('disease.successEdit') })
      } else {
        const createPayload: PatientDiseaseCreate = {
          ...data,
          diagnosis_date: formatDateForApi(new Date(data.diagnosis_date))!,
        }
        await addDisease(createPayload)
        Toast.show({ type: 'success', text1: t('disease.successAdd') })
      }
      navigation.goBack()
    } catch (error: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        error instanceof Error ? error.message : t('errors.genericMessage')
      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: { padding: 20 },
        errorText: {
          color: themeColors.alert,
          fontSize: 12,
          marginTop: 5,
          paddingLeft: 5,
        },
        inputContainer: {
          marginBottom: 15,
        },
        label: {
          color: themeColors.secondaryText,
          fontSize: 16,
          marginBottom: 8,
        },
        spinner: { marginTop: 20 },
      }),
    [themeColors],
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={isEditMode ? t('disease.edit') : t('disease.add')}
        canGoBack
        rightActions={[
          {
            icon: 'save-outline',
            onPress: handleSubmit(handleSave),
            disabled: isSubmitting || loading,
            tooltip: t('tooltips.saveChanges'),
          },
        ]}
      />
      <ScrollView>
        <View style={styles.content}>
          {isSubmitting && (
            <ActivityIndicator
              size="small"
              color={themeColors.primary}
              style={{ alignSelf: 'center', marginBottom: 10 }}
            />
          )}
          {isEditMode ? (
            <View style={styles.inputContainer}>
              <FormInput
                label={t('disease.nameLabel')}
                value={diseaseName}
                editable={false}
              />
            </View>
          ) : (
            <SelectInput
              control={control}
              name="disease_uuid"
              label={t('disease.nameLabel')}
              placeholder={
                masterListLoading
                  ? t('common.loading')
                  : t('disease.searchPlaceholder')
              }
              options={diseaseOptions}
              dialogTitle={t('disease.title')}
              disabled={masterListLoading || isSubmitting}
            />
          )}

          <View style={styles.inputContainer}>
            <DateTimePickerInput
              control={control}
              name="diagnosis_date"
              label={t('disease.diagnosed_at_label')}
            />
          </View>

          <Controller
            control={control}
            name="severity"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <PaperText
                  style={styles.label}
                >{`${t('disease.severityLabel')} (${t('common.optional')})`}</PaperText>
                <SegmentedButtons
                  value={value || ''}
                  onValueChange={onChange}
                  buttons={severityOptions}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <FormInput
                  label={`${t('common.notes')} (${t('common.optional')})`}
                  placeholder={t('disease.notesPlaceholder')}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  editable={!isSubmitting}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="is_active"
            render={({ field: { onChange, value } }) => (
              <ChecklistItem
                labelChecked={t('disease.status.active')}
                labelUnchecked={t('disease.status.inactive')}
                isChecked={value}
                onPress={() => onChange(!value)}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DiseaseFormScreen
