import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useTheme } from '@/contexts/ThemeContext'
import { useAddressStore } from '@/store/address/address.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import ScreenHeader from '@/components/ScreenHeader'
import { CustomButton, CustomTextInput } from '@emergqr/ui'
import { AddressPayload } from '@/services/client/addressService'

type AddressFormScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'AddressForm'
>

const AddressFormScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const route = useRoute<AddressFormScreenRouteProp>()

  const addressUuid = route.params?.addressUuid
  const isEditMode = !!addressUuid

  const { addresses, addAddress, editAddress } = useAddressStore()

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      const addressToEdit = addresses.find((addr) => addr.uuid === addressUuid)
      if (addressToEdit) {
        setStreet(addressToEdit.street)
        setCity(addressToEdit.city)
        setState(addressToEdit.state)
        setCountry(addressToEdit.country)
        setPostalCode(addressToEdit.postal_code)
      }
    }
  }, [isEditMode, addressUuid, addresses])

  const handleSave = async () => {
    if (!street || !city || !state || !country || !postalCode) {
      Alert.alert(t('errors.validationTitle'), t('errors.emptyFields'))
      return
    }

    const payload: AddressPayload = {
      street,
      city,
      state,
      country,
      postal_code: postalCode,
    }

    setIsSaving(true)

    try {
      if (isEditMode) {
        await editAddress(addressUuid, payload)
        Toast.show({
          type: 'success',
          text1: t('addressForm.successEdit'),
        })
      } else {
        await addAddress(payload)
        Toast.show({
          type: 'success',
          text1: t('addressForm.successAdd'),
        })
      }
      navigation.goBack()
    } catch (error) {
      Alert.alert(t('errors.genericTitle'), t('errors.genericMessage'))
    } finally {
      setIsSaving(false)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: { padding: 20 },
        spinner: { marginTop: 20 },
      }),
    [themeColors],
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={
          isEditMode ? t('addressForm.editTitle') : t('addressForm.createTitle')
        }
        canGoBack
      />
      <ScrollView>
        <View style={styles.content}>
          <CustomTextInput
            label={t('addressForm.streetLabel')}
            placeholder={t('addressForm.streetPlaceholder')}
            value={street}
            onChangeText={setStreet}
            editable={!isSaving}
          />
          <CustomTextInput
            label={t('addressForm.cityLabel')}
            placeholder={t('addressForm.cityPlaceholder')}
            value={city}
            onChangeText={setCity}
            editable={!isSaving}
          />
          <CustomTextInput
            label={t('addressForm.stateLabel')}
            placeholder={t('addressForm.statePlaceholder')}
            value={state}
            onChangeText={setState}
            editable={!isSaving}
          />
          <CustomTextInput
            label={t('addressForm.countryLabel')}
            placeholder={t('addressForm.countryPlaceholder')}
            value={country}
            onChangeText={setCountry}
            editable={!isSaving}
          />
          <CustomTextInput
            label={t('addressForm.postalCodeLabel')}
            placeholder={t('addressForm.postalCodePlaceholder')}
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            editable={!isSaving}
          />

          {isSaving ? (
            <ActivityIndicator
              size="large"
              color={themeColors.primary}
              style={styles.spinner}
            />
          ) : (
            <CustomButton
              title={t('addressForm.saveButton')}
              onPress={handleSave}
              disabled={isSaving}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddressFormScreen
