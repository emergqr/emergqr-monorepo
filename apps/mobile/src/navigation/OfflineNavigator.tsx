import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ManageQRScreen from '@/screens/profile/ManageQRScreen'

export type OfflineStackParamList = {
  ManageQR: undefined
}

const Stack = createNativeStackNavigator<OfflineStackParamList>()

const OfflineNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // La pantalla del QR ya tiene su propio header
      }}
    >
      <Stack.Screen name="ManageQR" component={ManageQRScreen} />
    </Stack.Navigator>
  )
}

export default OfflineNavigator
