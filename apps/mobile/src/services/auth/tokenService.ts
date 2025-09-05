import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUTH_TOKEN_KEY } from '@/constants/storageKeys'

/**
 * Saves the authentication token to the device's storage.
 * @param {string} token - The JWT token to be saved.
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error saving the authentication token', error)
    // Optionally, re-throw the error to be handled by the caller.
  }
}

/**
 * Retrieves the authentication token from the device's storage.
 * @returns {Promise<string | null>} A promise that resolves with the token, or null if it doesn't exist or an error occurs.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
  } catch (error) {
    console.error('Error retrieving the authentication token', error)
    return null
  }
}

/**
 * Removes the authentication token from the device's storage.
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
  } catch (error) {
    console.error('Error removing the authentication token', error)
  }
}
