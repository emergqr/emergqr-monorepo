import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '@/contexts/ThemeContext'
import CustomTextInput from '@/components/CustomTextInput'
import CustomButton from '@/components/CustomButton'
import { AuthStackParamList } from '@/navigation/types'
import { isValidEmail, isValidPassword } from '@/utils/validators'
import { useAuthStore as useAuth } from '@/store/auth/auth.store'
import { useNetworkStore } from '@/store/network/network.store'
import AuthFormHeader from '@/components/AuthFormHeader'

const getThemedStyles = (
  themeColors: ReturnType<typeof useTheme>['themeColors'],
) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: themeColors.background,
      flex: 1,
      justifyContent: 'center',
    },
    formContainer: {
      alignItems: 'center',
      paddingHorizontal: 20,
      width: '100%',
    },
    registerText: {
      color: themeColors.primary,
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    },
  })

const LoginScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const signIn = useAuth((state) => state.signIn)
  const isLoading = useAuth((state) => state.isLoading)
  const isOnline = useNetworkStore((state) => state.isOnline)
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const styles = useMemo(() => getThemedStyles(themeColors), [themeColors])

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('errors.validationTitle'), t('errors.emptyFields'))
      return
    }
    if (!isValidEmail(email)) {
      Alert.alert(t('errors.validationTitle'), t('errors.invalidEmail'))
      return
    }
    if (!isValidPassword(password)) {
      Alert.alert(t('errors.validationTitle'), t('errors.weakPassword'))
      return
    }

    try {
      await signIn({ email, password })
    } catch (error: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        error instanceof Error ? error.message : t('errors.loginFailed')
      Alert.alert(t('errors.loginFailed'), message)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <AuthFormHeader
          title={t('login.title')}
          imageSource={require('../../assets/images/short/logo_bluegreenR.png')}
        />
        <CustomTextInput
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          style={{ width: '100%', marginBottom: 15 }}
        />

        <CustomTextInput
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          editable={!isLoading}
          style={{ width: '100%' }}
          right={
            <TextInput.Icon
              icon={isPasswordVisible ? 'eye-off' : 'eye'}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            />
          }
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
            title={t('login.loginButton')}
            onPress={handleLogin}
            disabled={isLoading || !isOnline}
            style={{ marginTop: 20, width: '100%' }}
          />
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={{ width: '100%' }}
        >
          <Text style={styles.registerText}>{t('login.noAccount')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
