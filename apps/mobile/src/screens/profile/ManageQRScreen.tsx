import React, { useEffect, useMemo, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import QRCode from 'react-native-qrcode-svg'
import * as MediaLibrary from 'expo-media-library'
import Toast from 'react-native-toast-message'
import * as FileSystem from 'expo-file-system'

import { useTheme } from '@/contexts/ThemeContext'
import { useQRStore } from '@/store/qr/qr.store'
import { ScreenHeader } from '@emergqr/ui'

const ManageQRScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation()
  // Se ha añadido el tipo correcto para la referencia del componente QRCode.
  const qrCodeRef = useRef<QRCode>(null)

  const { qrData, isLoading, error, fetchQR, regenerateQR } = useQRStore(
    (state) => ({
      qrData: state.qrData,
      isLoading: state.isLoading,
      error: state.error,
      fetchQR: state.fetchQR,
      regenerateQR: state.regenerateQR,
    }),
  )

  useEffect(() => {
    fetchQR()
  }, [fetchQR])

  useEffect(() => {
    if (qrData) {
      const saveQRForOfflineUse = async () => {
        await AsyncStorage.setItem('offline_qr_data', qrData)
      }
      saveQRForOfflineUse()
    }
  }, [qrData])

  const handleDownload = async () => {
    if (!qrCodeRef.current) {
      Alert.alert(t('qr.downloadErrorTitle'), t('qr.downloadErrorMessage'))
      return
    }

    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        t('qr.permissionDeniedTitle'),
        t('qr.permissionDeniedMessage'),
      )
      return
    }

    qrCodeRef.current.toDataURL(async (data: string) => {
      const filePath = FileSystem.cacheDirectory + 'emergqr.png'
      try {
        await FileSystem.writeAsStringAsync(filePath, data, {
          encoding: FileSystem.EncodingType.Base64,
        })

        const asset = await MediaLibrary.createAssetAsync(filePath)
        await MediaLibrary.createAlbumAsync('EmergQR', asset, false)
        Toast.show({
          type: 'success',
          text1: t('qr.downloadSuccessTitle'),
          text2: t('qr.downloadSuccessMessage'),
        })
      } catch (e) {
        console.error('Failed to save QR code:', e)
        Toast.show({
          type: 'error',
          text1: t('qr.downloadErrorTitle'),
          text2: t('qr.downloadErrorMessage'),
        })
      }
    })
  }

  const handleShare = async () => {
    if (!qrData) return
    try {
      await Share.share({
        message: t('qr.shareMessage', { url: qrData }),
        title: t('qr.shareTitle'),
      })
    } catch (error: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        error instanceof Error ? error.message : t('qr.shareError')
      Toast.show({
        type: 'error',
        text1: t('qr.shareTitle'),
        text2: message,
      })
    }
  }

  const handleRegenerate = () => {
    Alert.alert(
      t('qr.regenerateConfirmTitle'),
      t('qr.regenerateConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.regenerate'),
          style: 'destructive',
          onPress: () => regenerateQR(),
        },
      ],
    )
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        actionButton: {
          alignItems: 'center',
          backgroundColor: themeColors.primary,
          borderRadius: 8,
          flexDirection: 'row',
          paddingHorizontal: 12,
          paddingVertical: 10,
        },
        actionButtonText: {
          color: themeColors.primaryText,
          fontSize: 14,
          fontWeight: '500',
          marginLeft: 8,
        },
        actionsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
        },
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        },
        errorContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        },
        errorText: {
          color: themeColors.alert,
          fontSize: 18,
          marginBottom: 20,
          textAlign: 'center',
        },
        infoText: {
          color: themeColors.text,
          fontSize: 16,
          marginBottom: 30,
          paddingHorizontal: 20,
          textAlign: 'center',
        },
        loadingContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
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
      <ScreenHeader
        title={t('qr.title')}
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <View style={styles.content}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.infoText, { marginTop: 20 }]}>
              {t('qr.loading')}
            </Text>
          </View>
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => fetchQR()}
            >
              <Ionicons
                name="refresh"
                size={20}
                color={themeColors.primaryText}
              />
              <Text style={styles.actionButtonText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {qrData && !isLoading && !error && (
          <>
            <Text style={styles.infoText}>{t('qr.info')}</Text>
            <View style={styles.qrContainer}>
              <QRCode
                value={qrData}
                size={250}
                backgroundColor="white"
                color="black"
                getRef={(c) => (qrCodeRef.current = c)}
              />
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDownload}
              >
                <Ionicons
                  name="download-outline"
                  size={24}
                  color={themeColors.primaryText}
                />
                <Text style={styles.actionButtonText}>
                  {t('common.download')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Ionicons
                  name="share-social-outline"
                  size={24}
                  color={themeColors.primaryText}
                />
                <Text style={styles.actionButtonText}>{t('common.share')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRegenerate}
              >
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={themeColors.primaryText}
                />
                <Text style={styles.actionButtonText}>
                  {t('common.regenerate')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

export default ManageQRScreen
