/**
 * Data Transfer Object for updating a client's profile.
 * All fields are optional.
 */
export interface UpdateClientDto {
  name?: string
  phone?: string
  birth_date?: string | null
  sex?: string | null
  occupation?: string | null
  preferred_language?: string | null
}
