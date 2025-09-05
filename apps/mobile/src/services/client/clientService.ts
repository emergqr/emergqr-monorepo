import { ApiHandler } from '../apiHandler'
import { Client } from '../../../../../packages/core/src/domain/interfaces/client/client.interface'
import { UpdateClientDto } from '../../../../../packages/core/src/domain/interfaces/client/update-client.dto'
import { ClientPaths } from '@/constants/apiPaths'

const { EXPO_PUBLIC_API_CLIENT_ME_BASE: CLIENT_ME_BASE_ENDPOINT } = process.env

if (!CLIENT_ME_BASE_ENDPOINT) {
  throw new Error(
    'The client base API endpoint is not defined in environment variables.',
  )
}

/**
 * Fetches the profile of the currently authenticated user.
 * The authentication token is handled automatically by the ApiHandler.
 * @returns {Promise<Client>} A promise that resolves with the user's profile data.
 */
export const getProfile = async (): Promise<Client> => {
  return ApiHandler.get<Client>(
    `${CLIENT_ME_BASE_ENDPOINT}${ClientPaths.PROFILE}`,
  )
}

/**
 * Updates the profile of the currently authenticated user.
 * @param {UpdateClientDto} data - The data to update (e.g., name, phone).
 * @returns {Promise<Client>} A promise that resolves with the updated user's profile data.
 */
export const updateProfile = async (data: UpdateClientDto): Promise<Client> => {
  return ApiHandler.put<UpdateClientDto, Client>(CLIENT_ME_BASE_ENDPOINT, data)
}

// --- Ejemplo de cómo añadirías una nueva función ---
/**
 * Elimina la cuenta del usuario autenticado.
 */
export const deleteAccount = async (): Promise<void> => {
  // Fíjate que aquí usamos la URL base directamente
  return ApiHandler.delete<void>(CLIENT_ME_BASE_ENDPOINT)
}
