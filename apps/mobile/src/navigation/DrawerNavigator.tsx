import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigatorScreenParams } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import DashboardScreen from '@/screens/DashboardScreen'
import ManageQRScreen from '@/screens/profile/ManageQRScreen' // <-- 1. Importar la pantalla REAL
import CustomDrawerContent from '@/components/navigation/CustomDrawerContent'
import ProfileStackNavigator, {
  ProfileStackParamList,
} from '@/navigation/ProfileStackNavigator'
import { useTheme } from '@/contexts/ThemeContext'

export type DrawerParamList = {
  Dashboard: undefined
  ManageQR: undefined
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>
}

const Drawer = createDrawerNavigator<DrawerParamList>()

const DrawerNavigator = () => {
  const { t } = useTranslation()
  const { theme, themeColors } = useTheme()

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Usamos nuestro propio header personalizado.
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: themeColors.background,
          width: 280,
        },
        drawerActiveTintColor: themeColors.primary,
        drawerInactiveTintColor: themeColors.text,
        drawerActiveBackgroundColor:
          theme === 'light'
            ? 'rgba(0, 122, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.1)',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
          fontWeight: '500',
        },
        drawerItemStyle: {
          borderRadius: 8,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: t('dashboard.welcome'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ManageQR"
        component={ManageQRScreen}
        options={{
          title: t('dashboard.manageQR'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: t('dashboard.myProfile'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator
