import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { Address } from '@/interfaces/client/address.interface'

interface AddressListItemProps {
  address: Address
  onEdit: () => void
  onDelete: () => void
}

const AddressListItem: React.FC<AddressListItemProps> = ({
  address,
  onEdit,
  onDelete,
}) => {
  const { themeColors } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        actionButton: {
          marginLeft: 8,
          padding: 8,
        },
        actionsContainer: {
          flexDirection: 'row',
          marginLeft: 10,
        },
        card: {
          alignItems: 'center',
          backgroundColor: themeColors.card,
          borderRadius: 8,
          elevation: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          padding: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
        },
        details: {
          color: themeColors.text,
          fontSize: 14,
          opacity: 0.8,
        },
        infoContainer: {
          flex: 1,
        },
        street: {
          color: themeColors.text,
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 4,
        },
      }),
    [themeColors],
  )

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.street}>{address.street}</Text>
        <Text
          style={styles.details}
        >{`${address.city}, ${address.state}`}</Text>
        <Text
          style={styles.details}
        >{`${address.country}, ${address.postal_code}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons
            name="create-outline"
            size={24}
            color={themeColors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={24} color={themeColors.alert} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddressListItem
