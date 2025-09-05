import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyProfileScreen from '@/screens/profile/MyProfileScreen'
import EditProfileScreen from '@/screens/profile/EditProfileScreen'
import ChangePasswordScreen from '@/screens/auth/ChangePasswordScreen'
import AddressListScreen from '@/screens/profile/AddressListScreen'
import AddressFormScreen from '@/screens/profile/AddressFormScreen'
import ContactListScreen from '@/screens/contact/ContactListScreen'
import ContactFormScreen from '@/screens/contact/ContactFormScreen'
import EmergencyDataScreen from '@/screens/profile/EmergencyDataScreen'
import AllergyListScreen from '@/screens/profile/AllergyListScreen'
import { AllergyRead } from '../../../../packages/core/src/domain/interfaces/client/allergy.interface'
import DiseaseListScreen from '@/screens/diseases/DiseaseListScreen'
import AllergyFormScreen from '@/screens/profile/AllergyFormScreen'
import DiseaseFormScreen from '@/screens/diseases/DiseaseFormScreen'
import VitalSignListScreen from '@/screens/vitals/VitalSignListScreen'
import VitalSignFormScreen from '@/screens/vitals/VitalSignFormScreen'
import MedicalHistoryScreen from '@/screens/medical-history/MedicalHistoryScreen'
import MedicalEventFormScreen from '@/screens/medical-history/MedicalEventFormScreen'
import { MedicationListScreen } from '@/screens/profile/MedicationListScreen'
import MedicationFormScreen from '@/screens/profile/MedicationFormScreen'

export type ProfileStackParamList = {
  MyProfile: undefined
  EditProfile: undefined
  ChangePassword: undefined
  AddressList: undefined
  AddressForm: { addressUuid?: string } | undefined
  ContactList: undefined
  ContactForm: { contactUuid?: string } | undefined
  EmergencyData: undefined
  AllergyList: undefined
  AllergyForm: { allergy: AllergyRead } | undefined
  DiseaseList: undefined
  DiseaseForm: { associationUuid?: string } | undefined
  VitalSignList: undefined
  VitalSignForm: { vitalSignUuid?: string; type?: string } | undefined
  MedicalHistory: undefined
  MedicalEventForm: { eventUuid?: string } | undefined
  MedicationList: undefined
  MedicationForm: { scheduleId?: string } | undefined
}

const Stack = createNativeStackNavigator<ProfileStackParamList>()

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="AddressForm" component={AddressFormScreen} />
      <Stack.Screen name="ContactList" component={ContactListScreen} />
      <Stack.Screen name="ContactForm" component={ContactFormScreen} />
      <Stack.Screen name="EmergencyData" component={EmergencyDataScreen} />
      <Stack.Screen
        name="AllergyList"
        component={AllergyListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllergyForm"
        component={AllergyFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiseaseList"
        component={DiseaseListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiseaseForm"
        component={DiseaseFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="VitalSignList" component={VitalSignListScreen} />
      <Stack.Screen name="VitalSignForm" component={VitalSignFormScreen} />
      <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
      <Stack.Screen
        name="MedicalEventForm"
        component={MedicalEventFormScreen}
      />
      <Stack.Screen name="MedicationList" component={MedicationListScreen} />
      <Stack.Screen name="MedicationForm" component={MedicationFormScreen} />
    </Stack.Navigator>
  )
}

export default ProfileStackNavigator
