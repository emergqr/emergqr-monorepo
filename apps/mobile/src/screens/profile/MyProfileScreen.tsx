import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImagePicker from 'expo-image-picker'

import { useTheme } from '@/contexts/ThemeContext'
import { useProfileStore } from '@/store/profile/profile.store'
import { ScreenHeader } from '@emergqr/ui'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import api from '@/services/api'
import GlobalLanguageSelector from '@/components/forms/GlobalLanguageSelector'

// Se define un tipo para los ítems de navegación para mayor seguridad y claridad.
type NavItem = {
  label: string
  // Se usa el tipo de los nombres de los iconos directamente desde el componente.
  icon: React.ComponentProps<typeof Ionicons>['name']
  target: keyof ProfileStackParamList | null
}

const MyProfileScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const {
    profile,
    isFetching,
    isUploadingAvatar,
    error,
    fetchProfile,
    uploadAvatar,
  } = useProfileStore()
  const [isLangModalVisible, setLangModalVisible] = useState(false)
  const [avatarLoadError, setAvatarLoadError] = useState(false)

  const apiOrigin = useMemo(() => {
    if (!api.defaults.baseURL) return ''
    try {
      return new URL(api.defaults.baseURL).origin
    } catch {
      return ''
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Se envuelve en useCallback para estabilizar la función y evitar re-renders innecesarios.
  const getCorrectAvatarUrl = useCallback(
    (backendUrl?: string | null): string | undefined => {
      if (!backendUrl) {
        return undefined
      }
      try {
        const clientBaseUrl = apiOrigin
        const urlObject = new URL(backendUrl)
        const path = urlObject.pathname
        return `${clientBaseUrl}${path}`
      } catch (e) {
        console.error(`URL inválida para el avatar: ${backendUrl}`, e)
        return undefined
      }
    },
    [apiOrigin],
  )

  useEffect(() => {
    if (profile) {
      setAvatarLoadError(false)
    }
    // Se añade getCorrectAvatarUrl a las dependencias del useEffect.
  }, [profile, getCorrectAvatarUrl])

  const processImage = async (uri: string) => {
    try {
      await uploadAvatar(uri)
    } catch (e: unknown) {
      // Se cambia 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        e instanceof Error ? e.message : t('errors.genericMessage')
      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        t('profile.permissionTitle'),
        t('profile.cameraPermissionMessage'),
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      processImage(result.assets[0].uri)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(t('profile.permissionTitle'), t('profile.permissionMessage'))
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      processImage(result.assets[0].uri)
    }
  }

  const handleAvatarPress = () => {
    Alert.alert(
      t('profile.selectAvatarTitle'),
      t('profile.selectAvatarMessage'),
      [
        {
          text: t('profile.takePhoto'),
          onPress: takePhoto,
        },
        {
          text: t('profile.chooseFromLibrary'),
          onPress: pickImage,
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ],
    )
  }

  const handleEditPress = () => {
    navigation.navigate('EditProfile')
  }

  const navItems: NavItem[] = [
    {
      label: t('profile.myAddresses'),
      icon: 'location-outline',
      target: 'AddressList',
    },
    {
      label: t('profile.emergencyData'),
      icon: 'medkit-outline',
      target: 'EmergencyData',
    },
    {
      label: t('profile.emergencyContacts'),
      icon: 'people-outline',
      target: 'ContactList',
    },
    {
      label: t('profile.diseases'),
      icon: 'pulse-outline',
      target: 'DiseaseList',
    },
    {
      label: t('profile.allergies'),
      icon: 'alert-circle-outline',
      target: 'AllergyList',
    },
    {
      label: t('profile.vital-sign'),
      icon: 'heart-circle-outline',
      target: 'VitalSignList',
    },
    {
      label: t('profile.treatments'),
      icon: 'medkit-outline',
      target: 'MedicationList',
    },
    {
      label: t('medical_history.title'),
      icon: 'document-text-outline',
      target: 'MedicalHistory',
    },
    {
      label: t('profile.reminders'),
      icon: 'alarm-outline',
      target: null,
    },
  ]

  const styles = useMemo(
    () =>
      StyleSheet.create({
        avatar: {
          backgroundColor: themeColors.border,
          borderRadius: 60,
          height: 120,
          width: 120,
        },
        avatarContainer: {
          alignItems: 'center',
          marginVertical: 20,
        },
        avatarOverlay: {
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 60,
          justifyContent: 'center',
        },
        avatarPlaceholder: {
          alignItems: 'center',
          backgroundColor: themeColors.border,
          borderRadius: 60,
          height: 120,
          justifyContent: 'center',
          width: 120,
        },
        cameraIconContainer: {
          backgroundColor: themeColors.primary,
          borderColor: themeColors.card,
          borderRadius: 20,
          borderWidth: 2,
          bottom: 0,
          padding: 8,
          position: 'absolute',
          right: 0,
        },
        container: {
          backgroundColor: themeColors.background,
          flex: 1,
        },
        content: {
          paddingBottom: 40,
          paddingHorizontal: 20,
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
        itemLabel: {
          color: themeColors.text,
          fontSize: 14,
          opacity: 0.6,
        },
        itemValue: {
          color: themeColors.text,
          fontSize: 18,
          fontWeight: '500',
        },
        loadingContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        },
        navItem: {
          alignItems: 'center',
          backgroundColor: themeColors.card,
          borderRadius: 8,
          elevation: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          padding: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
        },
        navItemContent: {
          alignItems: 'center',
          flexDirection: 'row',
        },
        navItemIcon: {
          color: themeColors.primary,
          marginRight: 15,
        },
        profileItem: {
          borderBottomColor: themeColors.border,
          borderBottomWidth: 1,
          paddingVertical: 15,
        },
      }),
    [themeColors],
  )

  if (isFetching && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchProfile}>
            <Ionicons
              name="refresh-circle"
              size={40}
              color={themeColors.primary}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const primaryAvatarUrl = getCorrectAvatarUrl(profile?.full_avatar_url)
  const defaultAvatarUrl = `${apiOrigin}/api/v1/avatars/default`
  const finalAvatarUrl = avatarLoadError ? defaultAvatarUrl : primaryAvatarUrl

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('profile.title')}
        onMenuPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        rightActions={[
          {
            icon: 'create-outline',
            onPress: handleEditPress,
            tooltip: t('tooltips.editProfile'),
            accessibilityLabel: t('tooltips.editProfile'),
          },
          {
            icon: 'lock-closed-outline',
            onPress: () => navigation.navigate('ChangePassword'),
            tooltip: t('tooltips.changePassword'),
            accessibilityLabel: t('tooltips.changePassword'),
          },
          {
            icon: 'language-outline',
            onPress: () => setLangModalVisible(true),
            tooltip: t('editProfile.languageLabel'),
            accessibilityLabel: t('editProfile.languageLabel'),
          },
        ]}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={handleAvatarPress}
            disabled={isUploadingAvatar}
          >
            <View>
              {finalAvatarUrl ? (
                <Image
                  source={{ uri: finalAvatarUrl }}
                  style={styles.avatar}
                  key={finalAvatarUrl}
                  onError={(e) => {
                    if (!avatarLoadError) {
                      console.error(
                        'Fallo al cargar avatar principal, intentando con silueta:',
                        e.nativeEvent.error,
                      )
                      setAvatarLoadError(true)
                    }
                  }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons
                    name="person"
                    size={60}
                    color={themeColors.secondaryText}
                  />
                </View>
              )}
              {!isUploadingAvatar && (
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={20} color={themeColors.card} />
                </View>
              )}
              {isUploadingAvatar && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.profileItem}>
          <Text style={styles.itemLabel}>{t('profile.name')}</Text>
          <Text style={styles.itemValue}>{profile?.name}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.itemLabel}>{t('profile.email')}</Text>
          <Text style={styles.itemValue}>{profile?.email}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.itemLabel}>{t('profile.phone')}</Text>
          <Text style={styles.itemValue}>
            {profile?.phone || t('profile.notProvided')}
          </Text>
        </View>

        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, !item.target && { opacity: 0.5 }]}
            onPress={() => {
              if (item.target) {
                navigation.navigate(item.target)
              }
            }}
            disabled={!item.target}
          >
            <View style={styles.navItemContent}>
              <Ionicons
                name={item.icon} // Se ha eliminado el cast a 'any'
                size={24}
                style={styles.navItemIcon}
              />
              <Text style={styles.itemValue}>{item.label}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={themeColors.text}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <GlobalLanguageSelector
        visible={isLangModalVisible}
        onClose={() => setLangModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default MyProfileScreen
