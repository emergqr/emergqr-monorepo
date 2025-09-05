import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeColors } from '@/interfaces/ThemeColors.interface'
import { a_languages, LanguageCode } from '@/constants/languages'

interface LanguageSelectorProps {
  label: string
  selectedValue: LanguageCode
  onSelect: (value: LanguageCode) => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  label,
  selectedValue,
  onSelect,
}) => {
  const { themeColors } = useTheme()

  const styles = useMemo(() => getStyles(themeColors), [themeColors])

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {a_languages.map((option) => (
          <TouchableOpacity
            key={option.code}
            style={[
              styles.optionButton,
              selectedValue === option.code && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.code)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.code && styles.selectedOptionText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      color: themeColors.text,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
    optionButton: {
      alignItems: 'center',
      backgroundColor: themeColors.card,
      flex: 1,
      paddingVertical: 12,
    },
    optionText: {
      color: themeColors.text,
      fontSize: 16,
    },
    optionsContainer: {
      borderColor: themeColors.border,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    selectedOption: {
      backgroundColor: themeColors.primary,
    },
    selectedOptionText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
  })

export default LanguageSelector
