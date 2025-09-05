import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import {
  Appbar,
  Button,
  TextInput,
  HelperText,
  SegmentedButtons,
  Text,
  useTheme,
} from 'react-native-paper'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAllergyStore } from '@/store/allergy/allergy.store'
import {
  AllergyCreate,
  AllergyUpdate,
} from '../../../../../packages/core/src/domain/interfaces/client/allergy.interface'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'

/**
 * Factory function to create the allergy validation schema.
 * This allows us to use the `t` function for i18n messages while keeping
 * the schema definition outside the component's render cycle.
 * @param t - The translation function.
 */
const getAllergySchema = (t: (key: string) => string) =>
  z.object({
    allergen: z.string().min(2, t('allergy.validation.allergenRequired')),
    reaction_type: z.string().optional(),
    severity: z.string().optional(),
  })

type AllergyFormScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'AllergyForm'
>

// Infer the type from the schema factory's return type.
type AllergyFormData = z.infer<ReturnType<typeof getAllergySchema>>

const AllergyFormScreen = () => {
  const navigation = useNavigation()
  const route = useRoute<AllergyFormScreenRouteProp>()
  const { t } = useTranslation()
  const theme = useTheme()
  const { addAllergy, editAllergy, loading } = useAllergyStore()

  const severityOptions = [
    { value: 'low', label: t('allergy.severity.low') },
    { value: 'medium', label: t('allergy.severity.medium') },
    { value: 'high', label: t('allergy.severity.high') },
    { value: 'critical', label: t('allergy.severity.critical') },
  ]

  const existingAllergy = route.params?.allergy
  const isEditing = !!existingAllergy

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AllergyFormData>({
    resolver: zodResolver(getAllergySchema(t)),
    defaultValues: {
      allergen: existingAllergy?.allergen || '',
      reaction_type: existingAllergy?.reaction_type || '',
      severity: existingAllergy?.severity || '',
    },
  })

  const onSubmit = async (data: AllergyFormData) => {
    try {
      if (isEditing && existingAllergy) {
        await editAllergy(existingAllergy.uuid, data as AllergyUpdate)
      } else {
        await addAllergy(data as AllergyCreate)
      }
      navigation.goBack()
    } catch (error) {
      console.error('Failed to save allergy:', error)
      // El error ya se maneja en el store, se podría mostrar un Alert aquí si se desea.
    }
  }

  // Define styles inside the component to access the theme
  const styles = StyleSheet.create({
    button: { marginTop: 24 },
    container: { backgroundColor: theme.colors.background, flex: 1 },
    formContainer: { padding: 16 },
    input: { marginTop: 16 },
    label: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8, // Use theme color for better visibility
    },
  })

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={isEditing ? t('allergy.edit') : t('allergy.add')}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Controller
          control={control}
          name="allergen"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                label={t('allergy.allergen')}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.allergen}
                mode="outlined"
              />
              {errors.allergen && (
                <HelperText type="error">{errors.allergen.message}</HelperText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="reaction_type"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('allergy.reactionType')}
              value={value || ''}
              onBlur={onBlur}
              onChangeText={onChange}
              style={styles.input}
              mode="outlined"
            />
          )}
        />

        <Controller
          control={control}
          name="severity"
          render={({ field: { onChange, value } }) => (
            <View style={styles.input}>
              <Text variant="bodyLarge" style={styles.label}>
                {t('allergy.severityLabel')}
              </Text>
              <SegmentedButtons
                value={value || ''}
                onValueChange={onChange}
                buttons={severityOptions}
              />
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting || loading}
          disabled={isSubmitting || loading}
          style={styles.button}
        >
          {isSubmitting || loading ? t('allergy.saving') : t('common.save')}
        </Button>
      </ScrollView>
    </View>
  )
}

export default AllergyFormScreen
