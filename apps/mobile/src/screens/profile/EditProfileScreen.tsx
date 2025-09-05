import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useTheme } from '@/contexts/ThemeContext'
import { useProfileStore } from '@/store/profile/profile.store'
import ScreenHeader from '@/components/ScreenHeader'
import CustomTextInput from '@/components/CustomTextInput'
import GlobalLanguageSelector from '@/components/forms/GlobalLanguageSelector'
import { ClientUpdate } from '../../../../../packages/core/src/domain/interfaces/client/client-update.interface'

const EditProfileScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation = useNavigation()

  const { profile, isFetching, isUpdating, updateProfile } = useProfileStore()

  // Estado local para los campos del formulario
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [occupation, setOccupation] = useState('')
  const [isLangModalVisible, setLangModalVisible] = useState(false)

  useEffect(() => {
    // Rellenar el formulario con los datos del perfil cuando se cargan
    if (profile) {
      setName(profile.name || '')
      setPhone(profile.phone || '')
      setBirthDate(profile.birth_date || '')
      setSex(profile.sex || '')
      setOccupation(profile.occupation || '')
    }
  }, [profile])

  const handleSave = async () => {
    const updatePayload: ClientUpdate = {
      name,
      phone,
      birth_date: birthDate,
      sex,
      occupation,
    }

    try {
      await updateProfile(updatePayload)
      Toast.show({
        type: 'success',
        text1: t('editProfile.successMessage'),
      })
      navigation.goBack()
    } catch (error: unknown) {
      // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
      const message =
        error instanceof Error ? error.message : t('errors.genericMessage')
      Alert.alert(t('errors.genericTitle'), message)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        activityIndicator: {
          alignSelf: 'center',
          marginVertical: 10,
        },
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: { padding: 20, paddingBottom: 40 },
        loadingContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        },
      }),
    [themeColors],
  )

  if (isFetching && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={t('editProfile.title')}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('editProfile.title')}
        onBackPress={() => navigation.goBack()}
        rightActions={[
          {
            icon: 'save-outline',
            onPress: handleSave,
            disabled: isUpdating,
            tooltip: t('tooltips.saveChanges'),
          },
          {
            icon: 'language-outline',
            onPress: () => setLangModalVisible(true),
            tooltip: t('editProfile.languageLabel'),
            disabled: isUpdating,
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {isUpdating && (
          <ActivityIndicator
            size="small"
            color={themeColors.primary}
            style={styles.activityIndicator}
          />
        )}

        <CustomTextInput
          label={t('editProfile.nameLabel')}
          value={name}
          onChangeText={setName}
          editable={!isUpdating}
        />
        <CustomTextInput
          label={t('editProfile.phoneLabel')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!isUpdating}
        />
        <CustomTextInput
          label={t('editProfile.birthDateLabel')}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
          editable={!isUpdating}
        />
        <CustomTextInput
          label={t('editProfile.sexLabel')}
          value={sex}
          onChangeText={setSex}
          placeholder={t('editProfile.sexPlaceholder')}
          editable={!isUpdating}
        />
        <CustomTextInput
          label={t('editProfile.occupationLabel')}
          value={occupation}
          onChangeText={setOccupation}
          placeholder={t('editProfile.occupationPlaceholder')}
          editable={!isUpdating}
        />
      </ScrollView>
      <GlobalLanguageSelector
        visible={isLangModalVisible}
        onClose={() => setLangModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default EditProfileScreen
