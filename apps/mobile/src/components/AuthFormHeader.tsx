import React from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

const getThemedStyles = (
  themeColors: ReturnType<typeof useTheme>['themeColors'],
) =>
  StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      height: 200,
      marginBottom: 20,
      width: 150,
    },
    title: {
      color: themeColors.text,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
    },
  })

interface AuthFormHeaderProps {
  title: string
  imageSource: ImageSourcePropType
}

const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({
  title,
  imageSource,
}) => {
  const { themeColors } = useTheme()
  const styles = getThemedStyles(themeColors)

  return (
    <View style={styles.headerContainer}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default AuthFormHeader
