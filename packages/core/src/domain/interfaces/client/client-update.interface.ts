import { Address } from './address.interface'
import { EmergencyData } from './emergencyData.interface'

/**
 * Represents the data structure for updating a client's profile.
 * Corresponds to the 'ClientUpdate' schema in openapi.json.
 * All fields are optional as it's a partial update.
 */
export interface ClientUpdate {
  email?: string | null
  name?: string | null
  username?: string | null
  phone?: string | null
  birth_date?: string | null // date string (YYYY-MM-DD)
  sex?: string | null
  occupation?: string | null
  address?: Address | null
  emerg_data?: EmergencyData | null
  preferred_language?: string | null
}
