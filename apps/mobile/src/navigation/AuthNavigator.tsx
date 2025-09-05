import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '@/screens/auth/LoginScreen'
import RegisterScreen from '@/screens/auth/RegisterScreen'

/**
 * Define la correspondencia de tipos para el stack de navegación de autenticación.
 * Esto asegura la seguridad de tipos para los nombres de pantalla y sus parámetros.
 */
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

/**
 * Navegador para el flujo de autenticación (Login, Registro).
 * Estas pantallas se muestran cuando el usuario no está autenticado.
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
