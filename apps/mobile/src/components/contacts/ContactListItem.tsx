import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { Contact } from '@/interfaces/client/contact.interface'

interface ContactListItemProps {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  const { themeColors } = useTheme()
  const { t } = useTranslation()

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
        emergencyStatus: {
          fontSize: 14,
          fontStyle: 'italic',
          marginTop: 4,
        },
        infoContainer: {
          flex: 1,
        },
        isEmergency: {
          color: themeColors.primary,
          fontWeight: 'bold',
        },
        name: {
          color: themeColors.text,
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 4,
        },
        relationship: {
          fontSize: 14,
          color: themeColors.secondary, // Use a distinct color for the relationship
          fontStyle: 'italic',
          marginTop: 4,
        },
      }),
    [themeColors],
  )

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.details}>{contact.phone}</Text>
        <Text style={styles.details}>{contact.email}</Text>
        <Text style={styles.relationship}>{contact.relationship_type}</Text>
        <Text
          style={[
            styles.emergencyStatus,
            contact.is_emergency_contact && styles.isEmergency,
          ]}
        >
          {contact.is_emergency_contact
            ? t('contacts.isEmergencyContact')
            : t('contacts.isNotEmergencyContact')}
        </Text>
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

export default ContactListItem
