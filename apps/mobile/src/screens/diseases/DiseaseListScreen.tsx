import React, { useCallback, useMemo } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useTheme } from '@/contexts/ThemeContext'
import { useDiseaseStore } from '@/store/disease/disease.store'
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator'
import { ScreenHeader } from '@emergqr/ui'
import DiseaseListItem from '@/components/DiseaseListItem'

const DiseaseListScreen = () => {
  const { t } = useTranslation()
  const { themeColors } = useTheme()
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>()
  const { diseases, loading, error, fetchMyDiseases, removeDisease } =
    useDiseaseStore()

  useFocusEffect(
    useCallback(() => {
      fetchMyDiseases()
    }, [fetchMyDiseases]),
  )

  const handleDelete = (uuid: string, name: string) => {
    Alert.alert(
      t('disease.deleteTitle'), // Usamos la clave de i18n para el título
      t('disease.deleteConfirm', { name }), // Y para el mensaje
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDisease(uuid)
              // Usamos una clave nueva para el éxito de la eliminación
              Toast.show({
                type: 'success',
                text1: t('disease.successDelete', { name }),
              })
            } catch (err: unknown) {
              // Se ha cambiado 'any' por 'unknown' para un manejo de errores más seguro.
              const message =
                err instanceof Error ? err.message : t('errors.genericMessage')
              Alert.alert(t('errors.genericTitle'), message)
            }
          },
        },
      ],
    )
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        centerContainer: {
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        },
        container: { backgroundColor: themeColors.background, flex: 1 },
        content: { flex: 1, padding: 20 },
        emptyText: {
          color: themeColors.secondaryText,
          fontSize: 16,
          textAlign: 'center',
        },
        errorText: {
          color: themeColors.alert,
          fontSize: 16,
          textAlign: 'center',
        },
        list: { flex: 1 },
      }),
    [themeColors],
  )

  const renderContent = () => {
    if (loading && diseases.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )
    }

    if (diseases.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{t('disease.list.empty')}</Text>
        </View>
      )
    }

    return (
      <FlatList
        data={diseases}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <DiseaseListItem
            disease={item}
            onEdit={() =>
              navigation.navigate('DiseaseForm', { associationUuid: item.uuid })
            }
            onDelete={() => handleDelete(item.uuid, item.disease.name)}
          />
        )}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('disease.title')}
        canGoBack
        rightActions={[
          {
            icon: 'add-circle-outline',
            onPress: () => navigation.navigate('DiseaseForm', {}),
            tooltip: t('disease.add'),
            accessibilityLabel: t('disease.add'),
          },
        ]}
      />
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  )
}

export default DiseaseListScreen
