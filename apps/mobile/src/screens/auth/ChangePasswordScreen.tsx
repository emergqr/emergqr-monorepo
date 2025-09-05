import React, { useState, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/store/auth/auth.store'
import { ScreenHeader, CustomButton, CustomTextInput } from '@emergqr/ui'
import { ChangePasswordDto } from '../../../../../packages/core/src/domain/interfaces/auth/change-password.dto'
import { isValidPassword } from '@/utils/validators'

const ChangePasswordScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation()
  const { changePassword, isLoading } = useAuthStore((state) => ({
    changePassword: state.changePassword,
    isLoading: state.isLoading,
  }))

  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const changePasswordSchema = z
    .object({
      old_password: z.string().min(1, t('errors.emptyFields')),
      new_password: z.string().refine(isValidPassword, {
        message: t('errors.weakPassword'),
      }),
      new_passwordRepeat: z.string().min(1, t('errors.emptyFields')),
    })
    .refine((data) => data.new_password === data.new_passwordRepeat, {
      message: t('errors.passwordsDoNotMatch'),
      path: ['new_passwordRepeat'],
    })

  type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_passwordRepeat: '',
    },
  })

  const handleSave = async (data: ChangePasswordDto) => {
    try {
      await changePassword(data)
      Alert.alert(t('changePassword.title'), t('changePassword.successMessage'))
      navigation.goBack()
    } catch (error: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        error instanceof Error
          ? error.message
          : t('changePassword.errorMessage')
      Alert.alert(t('errors.validationTitle'), message)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: themeColors.background,
          flex: 1,
        },
        content: {
          padding: 20,
        },
        errorText: {
          color: themeColors.alert,
          fontSize: 12,
          marginTop: 5,
        },
        inputContainer: {
          marginBottom: 15,
        },
      }),
    [themeColors],
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('changePassword.title')}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Controller
          control={control}
          name="old_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <CustomTextInput
                label={t('changePassword.currentPasswordLabel')}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={!isOldPasswordVisible}
                error={!!errors.old_password}
                right={
                  <TextInput.Icon
                    icon={isOldPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setOldPasswordVisible(!isOldPasswordVisible)}
                  />
                }
              />
              {errors.old_password && (
                <Text style={styles.errorText}>
                  {errors.old_password.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="new_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <CustomTextInput
                label={t('changePassword.newPasswordLabel')}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={!isNewPasswordVisible}
                error={!!errors.new_password}
                right={
                  <TextInput.Icon
                    icon={isNewPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}
                  />
                }
              />
              {errors.new_password && (
                <Text style={styles.errorText}>
                  {errors.new_password.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="new_passwordRepeat"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <CustomTextInput
                label={t('changePassword.confirmPasswordLabel')}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={!isConfirmPasswordVisible}
                error={!!errors.new_passwordRepeat}
                right={
                  <TextInput.Icon
                    icon={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() =>
                      setConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  />
                }
              />
              {errors.new_passwordRepeat && (
                <Text style={styles.errorText}>
                  {errors.new_passwordRepeat.message}
                </Text>
              )}
            </View>
          )}
        />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <CustomButton
            title={t('changePassword.saveButton')}
            onPress={handleSubmit(handleSave)}
            disabled={isLoading}
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChangePasswordScreen
