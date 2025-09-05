import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '@/contexts/ThemeContext'
import { a_languages, LanguageCode } from '@/constants/languages'
import { ThemeColors } from '@/interfaces/ThemeColors.interface'

interface GlobalLanguageSelectorProps {
  visible: boolean
  onClose: () => void
}

const GlobalLanguageSelector: React.FC<GlobalLanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { t, i18n } = useTranslation()
  const { themeColors } = useTheme()
  const styles = getStyles(themeColors)

  const currentLanguage = i18n.language

  const handleSelectLanguage = (langCode: LanguageCode) => {
    i18n.changeLanguage(langCode)
    onClose()
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('editProfile.languageLabel')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={30}
                color={themeColors.text}
              />
            </TouchableOpacity>
          </View>
          {a_languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.optionButton}
              onPress={() => handleSelectLanguage(lang.code)}
            >
              <Text style={styles.optionText}>{lang.name}</Text>
              {currentLanguage.startsWith(lang.code) && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={themeColors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    modalContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: themeColors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    optionButton: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 15,
    },
    optionText: { color: themeColors.text, fontSize: 18 },
    title: { color: themeColors.text, fontSize: 22, fontWeight: 'bold' },
  })

export default GlobalLanguageSelector
