/**
 * Represents the basic client data returned by the API.
 * Corresponds to the 'Client' schema in openapi.json.
 */
export interface Client {
  id: number
  uuid: string
  email: string
  name?: string | null
  phone?: string | null
  birth_date?: string | null // date string (YYYY-MM-DD)
  preferred_language?: string | null
  sex?: string | null
  occupation?: string | null
  avatar_url?: string | null
  is_active: boolean
  is_admin: boolean
  created_at: string // datetime string
  full_avatar_url?: string | null // readOnly
  age?: number | null // readOnly
}
