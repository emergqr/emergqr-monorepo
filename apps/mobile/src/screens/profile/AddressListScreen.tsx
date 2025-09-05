import React, { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '@/contexts/ThemeContext'
import { useAddressStore } from '@/store/address/address.store'
import { ScreenHeader } from '@emergqr/ui'
import AddressListItem from '@/components/profile/AddressListItem'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'

const AddressListScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()

  const { addresses, isLoading, error, fetchAddresses, removeAddress } =
    useAddressStore()

  // Usamos useFocusEffect para que la lista se actualice cada vez que volvemos a esta pantalla
  useFocusEffect(
    useCallback(() => {
      fetchAddresses()
    }, [fetchAddresses]),
  )

  const handleAddAddress = () => {
    // Navega al formulario sin parámetros para indicar que es una creación
    navigation.navigate('AddressForm')
  }

  const handleEditAddress = (uuid: string) => {
    // Navega al formulario pasando el UUID para indicar que es una edición
    navigation.navigate('AddressForm', { addressUuid: uuid })
  }

  const handleDeleteAddress = (uuid: string) => {
    Alert.alert(
      t('addresses.deleteConfirmTitle'),
      t('addresses.deleteConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () =>
            removeAddress(uuid).catch(() => {
              // Muestra un error si la eliminación falla en el servidor
              Alert.alert(t('errors.genericTitle'), t('errors.genericMessage'))
            }),
        },
      ],
    )
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        centeredContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        },
        container: { backgroundColor: themeColors.background, flex: 1 },
        emptyText: {
          color: themeColors.text,
          fontSize: 18,
          textAlign: 'center',
        },
        errorText: {
          color: themeColors.alert,
          fontSize: 18,
          marginBottom: 20,
          textAlign: 'center',
        },
        listContent: { paddingBottom: 16, paddingHorizontal: 16 },
      }),
    [themeColors],
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchAddresses()}>
            <Ionicons
              name="refresh-circle"
              size={40}
              color={themeColors.primary}
            />
          </TouchableOpacity>
        </View>
      )
    }

    if (addresses.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>{t('addresses.noAddresses')}</Text>
        </View>
      )
    }

    return (
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.uuid!}
        renderItem={({ item }) => (
          <AddressListItem
            address={item}
            onEdit={() => handleEditAddress(item.uuid!)}
            onDelete={() => handleDeleteAddress(item.uuid!)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('addresses.title')}
        canGoBack
        rightActions={[
          {
            icon: 'add-circle-outline',
            onPress: handleAddAddress,
            tooltip: t('addresses.add'),
            accessibilityLabel: t('addresses.add'),
          },
        ]}
      />
      {renderContent()}
    </SafeAreaView>
  )
}

export default AddressListScreen
