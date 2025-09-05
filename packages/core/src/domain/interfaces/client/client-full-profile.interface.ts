import { Address } from './address.interface'
import { Allergy } from './allergy.interface'
import { Client } from './client.interface'
import { Contact } from './contact.interface'
import { Disease } from './disease.interface'
import { EmergencyData } from './emergencyData.interface'

/**
 * Represents the full user profile, including all related data.
 * Corresponds to the 'ClientFullProfile' schema in openapi.json.
 */
export interface ClientFullProfile extends Client {
  address: Address | null
  emerg_data: EmergencyData | null
  contact_associations: Contact[]
  allergies: Allergy[]
  patient_diseases: Disease[]
}
