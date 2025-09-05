import React, { useMemo } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '@/contexts/ThemeContext'

interface Action {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  color?: string
}

interface InfoCardProps {
  iconName: keyof typeof Ionicons.glyphMap
  iconColor?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  description?: string
  onPress?: () => void
  actions?: Action[]
}

const InfoCard: React.FC<InfoCardProps> = ({
  iconName,
  iconColor,
  title,
  subtitle,
  description,
  onPress,
  actions,
}) => {
  const { themeColors } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        actionButton: {
          marginLeft: 4,
          padding: 6,
        },
        actionsContainer: {
          alignItems: 'center',
          flexDirection: 'row',
        },
        container: {
          alignItems: 'center',
          backgroundColor: themeColors.card,
          borderRadius: 12,
          elevation: 2,
          flexDirection: 'row',
          marginVertical: 6,
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        contentContainer: {
          flex: 1,
        },
        descriptionText: {
          color: themeColors.secondaryText,
          fontSize: 14,
          marginTop: 2,
        },
        iconContainer: {
          marginRight: 16,
        },
        title: {
          color: themeColors.text,
          fontSize: 17,
          fontWeight: '600',
        },
      }),
    [themeColors],
  )

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconName}
          size={28}
          color={iconColor || themeColors.primary}
        />
      </View>

      <View style={styles.contentContainer}>
        {/* Renderiza el título como un Text si es un string, o como un componente si es un elemento */}
        {typeof title === 'string' ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          title
        )}
        {subtitle}
        {description && (
          <Text style={styles.descriptionText}>{description}</Text>
        )}
      </View>

      {actions && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <Ionicons
                name={action.icon}
                size={24}
                color={action.color || themeColors.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default InfoCard
