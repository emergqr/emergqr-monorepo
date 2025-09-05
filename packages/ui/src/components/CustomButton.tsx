import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { useTheme } from '@emergqr/theme'

interface CustomButtonProps {
  title: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    width: '75%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  disabled = false,
}) => {
  const { themeColors } = useTheme()

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: themeColors.primary, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: themeColors.background }]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton
