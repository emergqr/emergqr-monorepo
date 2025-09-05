import React, { useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useTheme } from '@/contexts/ThemeContext'
import { useContactStore } from '@/store/contacts/contact.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import { ScreenHeader } from '@emergqr/ui'
import FormInput from '@/components/forms/FormInput'
import ChecklistItem from '@/components/forms/ChecklistItem'
import { CustomButton } from '@emergqr/ui'
import {
  ContactCreate,
  ContactUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/contact.interface'

type ContactFormScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'ContactForm'
>

const ContactFormScreen = () => {
  const { t } = useTranslation()

  // 1. Define un esquema de validación con Zod
  const contactSchema = z.object({
    name: z.string().min(2, t('errors.validation.nameRequired')),
    email: z.string().email(t('errors.validation.invalidEmail')),
    phone: z.string().min(7, t('errors.validation.phoneRequired')),
    relationship_type: z
      .string()
      .min(3, t('errors.validation.relationshipRequired')),
    is_emergency_contact: z.boolean().optional().default(false),
  })

  type ContactFormData = z.infer<typeof contactSchema>

  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const route = useRoute<ContactFormScreenRouteProp>()

  const contactUuid = route.params?.contactUuid
  const isEditMode = !!contactUuid

  const { contacts, addContact, editContact } = useContactStore()

  // 2. Inicializa react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      relationship_type: '',
      is_emergency_contact: false,
    },
  })

  useEffect(() => {
    if (isEditMode) {
      const contactToEdit = contacts.find((c) => c.uuid === contactUuid)
      if (contactToEdit) {
        // 3. Rellena el formulario con los datos existentes
        reset(contactToEdit)
      }
    }
  }, [isEditMode, contactUuid, contacts, reset])

  // 4. Maneja el envío del formulario
  const onSave = async (data: ContactFormData) => {
    try {
      if (isEditMode && contactUuid) {
        const payload: ContactUpdate = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          relationship_type: data.relationship_type,
          is_emergency_contact: data.is_emergency_contact,
        }
        await editContact(contactUuid, payload)
        Toast.show({
          type: 'success',
          text1: t('contactForm.successEdit'),
        })
      } else {
        const payload: ContactCreate = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          relationship_type: data.relationship_type,
          is_emergency_contact: data.is_emergency_contact,
        }
        await addContact(payload)
        Toast.show({
          type: 'success',
          text1: t('contactForm.successAdd'),
        })
      }
      navigation.goBack()
    } catch (err: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      console.error('--- DEBUG: Error al guardar contacto ---')
      console.error('Full Error Object:', err)

      let message = t('errors.genericMessage')

      // Primero, intentamos obtener el mensaje de un objeto Error estándar.
      if (err instanceof Error) {
        message = err.message
      }

      // Luego, intentamos obtener un mensaje más específico de un error de API (común en Axios).
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response: unknown }).response
        if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response
        ) {
          const data = (response as { data: unknown }).data
          if (typeof data === 'object' && data !== null && 'detail' in data) {
            const detail = (data as { detail: unknown }).detail
            if (
              Array.isArray(detail) &&
              detail.length > 0 &&
              typeof (detail[0] as { msg?: string }).msg === 'string'
            ) {
              message = (detail[0] as { msg: string }).msg
            } else if (typeof detail === 'string') {
              message = detail
            }
          }
        }
      }

      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: { padding: 20 },
        spinner: { marginTop: 20 },
      }),
    [themeColors],
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={
          isEditMode ? t('contactForm.editTitle') : t('contactForm.createTitle')
        }
        canGoBack
      />
      <ScrollView>
        <View style={styles.content}>
          {/* 5. Usa el componente Controller para cada campo */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('contactForm.nameLabel')}
                placeholder={t('contactForm.namePlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                editable={!isSubmitting}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('contactForm.emailLabel')}
                placeholder={t('contactForm.emailPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('contactForm.phoneLabel')}
                placeholder={t('contactForm.phonePlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
            )}
          />
          <Controller
            control={control}
            name="relationship_type"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('contactForm.relationshipLabel')}
                placeholder={t('contactForm.relationshipPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.relationship_type?.message}
                editable={!isSubmitting}
              />
            )}
          />

          {/* 6. Usa el Controller para el nuevo ChecklistItem */}
          <Controller
            control={control}
            name="is_emergency_contact"
            render={({ field: { onChange, value } }) => (
              <ChecklistItem
                labelChecked={t('contacts.isEmergencyContact')}
                labelUnchecked={t('contacts.isNotEmergencyContact')}
                isChecked={!!value}
                onPress={() => onChange(!value)}
              />
            )}
          />

          {isSubmitting ? (
            <ActivityIndicator
              size="large"
              color={themeColors.primary}
              style={styles.spinner}
            />
          ) : (
            <CustomButton
              title={t('contactForm.saveButton')}
              onPress={handleSubmit(onSave)}
              disabled={isSubmitting}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ContactFormScreen
