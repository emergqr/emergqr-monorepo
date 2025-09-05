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
import { useContactStore } from '@/store/contacts/contact.store'
import ScreenHeader from '@/components/ScreenHeader'
import ContactListItem from '@/components/contacts/ContactListItem'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'

const ContactListScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()

  const { contacts, isLoading, error, fetchContacts, removeContact } =
    useContactStore()

  useFocusEffect(
    useCallback(() => {
      fetchContacts()
    }, [fetchContacts]),
  )

  const handleAddContact = () => {
    navigation.navigate('ContactForm')
  }

  const handleEditContact = (uuid: string) => {
    navigation.navigate('ContactForm', { contactUuid: uuid })
  }

  const handleDeleteContact = (uuid: string) => {
    Alert.alert(
      t('contacts.deleteConfirmTitle'),
      t('contacts.deleteConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () =>
            removeContact(uuid).catch(() => {
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
          <TouchableOpacity onPress={() => fetchContacts()}>
            <Ionicons
              name="refresh-circle"
              size={40}
              color={themeColors.primary}
            />
          </TouchableOpacity>
        </View>
      )
    }

    if (contacts.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>{t('contacts.noContacts')}</Text>
        </View>
      )
    }

    return (
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <ContactListItem
            contact={item}
            onEdit={() => handleEditContact(item.uuid)}
            onDelete={() => handleDeleteContact(item.uuid)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('contacts.title')}
        canGoBack
        rightActions={[
          {
            icon: 'add-circle-outline',
            onPress: handleAddContact,
            tooltip: t('contacts.add'),
            accessibilityLabel: t('contacts.add'),
          },
        ]}
      />
      {renderContent()}
    </SafeAreaView>
  )
}

export default ContactListScreen
