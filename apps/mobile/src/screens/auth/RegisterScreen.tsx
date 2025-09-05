import React, { useMemo, useState } from 'react'
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuthStore } from '@/store/auth/auth.store'
import { CustomButton, CustomTextInput } from '@emergqr/ui'
import { useNetworkStore } from '@/store/network/network.store'
import { AuthStackParamList } from '@/navigation/types'
import AuthFormHeader from '@/components/AuthFormHeader'
import { isValidPassword } from '@/utils/validators'

const getThemedStyles = (
  themeColors: ReturnType<typeof useTheme>['themeColors'],
) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    errorText: {
      alignSelf: 'flex-start',
      color: themeColors.alert,
      fontSize: 12,
      marginTop: 5,
      width: '100%',
    },
    form: {
      alignItems: 'center',
      width: '100%',
    },
    inputContainer: {
      marginBottom: 15,
      width: '100%',
    },
    loginText: {
      color: themeColors.primary,
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    },
    safeArea: {
      backgroundColor: themeColors.background,
      flex: 1,
    },
    scrollContainer: {
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
  })

const getRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z
        .string()
        .min(1, t('errors.emptyFields'))
        .email(t('errors.invalidEmail')),
      password: z.string().refine(isValidPassword, {
        message: t('errors.weakPassword'),
      }),
      passwordRepeat: z.string().min(1, t('errors.emptyFields')),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: t('errors.passwordsDoNotMatch'),
      path: ['passwordRepeat'], // Path to field to show the error
    })

type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>

const RegisterScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const { signUp, isLoading } = useAuthStore()
  const isOnline = useNetworkStore((state) => state.isOnline)
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [isRepeatPasswordVisible, setRepeatPasswordVisible] = useState(false)

  const registerSchema = getRegisterSchema(t)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordRepeat: '',
    },
  })

  const styles = useMemo(() => getThemedStyles(themeColors), [themeColors])

  const handleRegister = async (data: RegisterFormData) => {
    try {
      // Navigation will be handled automatically by the state change in the auth store
      await signUp(data)
    } catch (error: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        error instanceof Error ? error.message : t('errors.registerFailed')
      Alert.alert(t('errors.registerFailed'), message)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <AuthFormHeader
              title={t('register.title')}
              imageSource={require('../../assets/images/short/logo_bluegreenR.png')}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <CustomTextInput
                    placeholder={t('register.emailPlaceholder')}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                    editable={!isLoading}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <CustomTextInput
                    placeholder={t('register.passwordPlaceholder')}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secureTextEntry={!isPasswordVisible}
                    error={!!errors.password}
                    editable={!isLoading}
                    right={
                      <TextInput.Icon
                        icon={isPasswordVisible ? 'eye-off' : 'eye'}
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                      />
                    }
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="passwordRepeat"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <CustomTextInput
                    placeholder={t('register.passwordRepeatPlaceholder')}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secureTextEntry={!isRepeatPasswordVisible}
                    error={!!errors.passwordRepeat}
                    editable={!isLoading}
                    right={
                      <TextInput.Icon
                        icon={isRepeatPasswordVisible ? 'eye-off' : 'eye'}
                        onPress={() =>
                          setRepeatPasswordVisible(!isRepeatPasswordVisible)
                        }
                      />
                    }
                  />
                  {errors.passwordRepeat && (
                    <Text style={styles.errorText}>
                      {errors.passwordRepeat.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {isLoading ? (
              <ActivityIndicator
                testID="activity-indicator"
                size="large"
                color={themeColors.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <CustomButton
                title={t('register.registerButton')}
                onPress={handleSubmit(handleRegister)}
                disabled={isLoading || !isOnline}
                style={{ marginTop: 20, width: '100%' }}
              />
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ width: '100%' }}
            >
              <Text style={styles.loginText}>{t('login.haveAccount')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterScreen
