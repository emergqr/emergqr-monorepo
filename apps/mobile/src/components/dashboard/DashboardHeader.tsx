import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'

interface DashboardHeaderProps {
  theme: 'light' | 'dark'
  isOffline: boolean
  onMenuPress: () => void
  onLanguageToggle: () => void
  onThemeToggle: () => void
  onSignOut: () => void
}

const DashboardHeader: FC<DashboardHeaderProps> = ({
  theme,
  isOffline,
  onMenuPress,
  onLanguageToggle,
  onThemeToggle,
  onSignOut,
}) => {
  const { themeColors } = useTheme()

  const styles = StyleSheet.create({
    header: {
      alignItems: 'center',
      borderBottomColor: themeColors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    headerRightContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    icon: {
      color: themeColors.text,
      fontSize: 26,
    },
    iconButton: {
      padding: 8,
    },
    logo: {
      height: 50,
      width: 50,
    },
  })

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
        <Ionicons name="menu" style={styles.icon} />
      </TouchableOpacity>

      <Image
        source={require('../../assets/images/short/logo_greenblueR.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.headerRightContainer}>
        <TouchableOpacity onPress={onLanguageToggle} style={styles.iconButton}>
          <Ionicons name="globe-outline" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onThemeToggle} style={styles.iconButton}>
          <Ionicons
            name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSignOut}
          style={styles.iconButton}
          disabled={isOffline}
        >
          <Ionicons
            name="log-out-outline"
            style={[styles.icon, { color: themeColors.alert }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DashboardHeader
