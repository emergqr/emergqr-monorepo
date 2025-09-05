import React, { FC } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Tooltip from 'react-native-walkthrough-tooltip'
import { useTheme } from '@/contexts/ThemeContext'

interface ScreenHeaderProps {
  title: string
  onMenuPress?: () => void
  onBackPress?: () => void
  canGoBack?: boolean
  rightActions?: {
    icon: keyof typeof Ionicons.glyphMap
    onPress: () => void
    tooltip: string
    color?: string
    disabled?: boolean
    testID?: string
    accessibilityLabel?: string
  }[]
}

const ScreenHeader: FC<ScreenHeaderProps> = ({
  title,
  onMenuPress,
  onBackPress,
  canGoBack,
  rightActions,
}) => {
  const { themeColors } = useTheme()
  const navigation = useNavigation()

  // Determine the left action and icon based on the props provided
  const showBackButton = canGoBack || !!onBackPress
  const onLeftPress =
    onBackPress ?? (canGoBack ? () => navigation.goBack() : onMenuPress)
  const leftIconName = showBackButton ? 'arrow-back-outline' : 'menu-outline'

  const styles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      backgroundColor: themeColors.background,
      borderBottomColor: themeColors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 12,
    },
    icon: {
      color: themeColors.text,
      fontSize: 28,
    },
    iconButton: {
      padding: 8,
    },
    leftContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1, // Allow this container to grow and push the right action
    },
    rightActionsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    rightIcon: {
      fontSize: 26,
      // El color ahora es dinámico
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: themeColors.text,
      marginLeft: 15,
      marginRight: 10, // Add some space so it doesn't touch the right icon
      flexShrink: 1, // Prevent title from pushing the right icon off-screen
    },
  })

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <Ionicons name={leftIconName} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.rightActionsContainer}>
        {rightActions?.map((action, index) => (
          <Tooltip
            key={index}
            isVisible={false} // We will control this with state if needed, for now it's on long press
            content={<Text>{action.tooltip}</Text>}
            placement="bottom"
            useInteractionManager={true} // For better performance
          >
            <TouchableOpacity
              onPress={action.onPress}
              style={styles.iconButton}
              disabled={action.disabled}
              testID={action.testID}
              accessibilityLabel={action.accessibilityLabel}
              accessibilityRole="button"
            >
              <Ionicons
                name={action.icon}
                style={[
                  styles.rightIcon,
                  {
                    color: action.color || themeColors.primary,
                    opacity: action.disabled ? 0.5 : 1,
                  },
                ]}
              />
            </TouchableOpacity>
          </Tooltip>
        ))}
      </View>
    </View>
  )
}

export default ScreenHeader
