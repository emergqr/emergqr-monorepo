import React, { useCallback, useMemo } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

import { useAllergyStore } from '@/store/allergy/allergy.store'
import InfoCard from '@/components/InfoCard' // Cambiamos la importación
import { AllergyRead } from '../../../../../packages/core/src/domain/interfaces/client/allergy.interface'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import ScreenHeader from '@/components/ScreenHeader'
import { useTheme } from '@/contexts/ThemeContext'

type AllergyListScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'AllergyList'
>

const AllergyListScreen = () => {
  const navigation = useNavigation<AllergyListScreenNavigationProp>()
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const { allergies, loading, error, fetchMyAllergies, removeAllergy } =
    useAllergyStore()

  useFocusEffect(
    useCallback(() => {
      fetchMyAllergies()
    }, [fetchMyAllergies]),
  )

  const handleAdd = () => {
    // Navega al formulario sin parámetros para crear una nueva alergia
    navigation.navigate('AllergyForm')
  }

  const handleEdit = (allergy: AllergyRead) => {
    navigation.navigate('AllergyForm', { allergy })
  }

  const handleDelete = (allergy: AllergyRead) => {
    Alert.alert(t('allergy.deleteTitle'), t('allergy.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => removeAllergy(allergy.uuid),
      },
    ])
  }

  const getSeverityColor = (severity: string | null) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return themeColors.alert
      case 'medium':
        return themeColors.primary
      default:
        return themeColors.secondaryText
    }
  }

  const severityStyles = useMemo(
    () =>
      StyleSheet.create({
        severityText: {
          fontSize: 14,
          fontWeight: '500',
          marginTop: 2,
        },
      }),
    [],
  )

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
    // Se cambia la condición para que coincida con ContactListScreen:
    // mostrar el loader siempre que 'loading' sea true.
    if (loading) {
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
          <TouchableOpacity onPress={() => fetchMyAllergies()}>
            <Ionicons
              name="refresh-circle"
              size={40}
              color={themeColors.primary}
            />
          </TouchableOpacity>
        </View>
      )
    }

    if (allergies.length === 0) {
      return (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>{t('allergy.list.empty')}</Text>
        </View>
      )
    }

    return (
      <FlatList
        data={allergies}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => {
          const severityColor = getSeverityColor(item.severity)
          return (
            <InfoCard
              iconName="alert-circle-outline"
              iconColor={severityColor}
              title={item.allergen}
              subtitle={
                item.severity && (
                  <Text
                    style={[
                      severityStyles.severityText,
                      { color: severityColor },
                    ]}
                  >
                    {t(`allergy.severity.${item.severity.toLowerCase()}`, {
                      defaultValue: item.severity,
                    })}
                  </Text>
                )
              }
              description={item.reaction_type || undefined}
              actions={[
                {
                  icon: 'create-outline',
                  onPress: () => handleEdit(item),
                  color: themeColors.text,
                },
                {
                  icon: 'trash-outline',
                  onPress: () => handleDelete(item),
                  color: themeColors.alert,
                },
              ]}
            />
          )
        }}
        contentContainerStyle={styles.listContent}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('allergy.title')}
        canGoBack
        rightActions={[
          {
            icon: 'add-circle-outline',
            onPress: handleAdd,
            tooltip: t('allergy.add'),
            accessibilityLabel: t('allergy.add'),
          },
        ]}
      />
      {renderContent()}
    </SafeAreaView>
  )
}

export default AllergyListScreen
