import React, { useMemo } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-native-qrcode-svg'
import { useTheme } from '@/contexts/ThemeContext'
import { ScreenHeader } from '@emergqr/ui'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/navigation/AppNavigator'

/**
 * Props for the OfflineQRScreen component, typed using helpers from React Navigation
 * for better type safety and autocompletion.
 */
type OfflineQRScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OfflineQR'
>

const OfflineQRScreen: React.FC<OfflineQRScreenProps> = ({ route }) => {
  const { qrData } = route.params
  const { t } = useTranslation()
  const { themeColors } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        },
        infoText: {
          color: themeColors.text,
          fontSize: 16,
          marginBottom: 30,
          paddingHorizontal: 20,
          textAlign: 'center',
        },
        qrContainer: {
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          elevation: 5,
          marginBottom: 30,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
      }),
    [themeColors],
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={t('qr.offlineTitle')} />
      <View style={styles.content}>
        <Text style={styles.infoText}>{t('qr.offlineInfo')}</Text>
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={250}
            backgroundColor="white"
            color="black"
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default OfflineQRScreen
