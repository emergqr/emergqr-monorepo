import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_UUID_KEY = 'user_uuid'

/**
 * Saves the user's UUID to AsyncStorage.
 * @param uuid - The user's UUID string.
 */
export const saveUserUUID = async (uuid: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_UUID_KEY, uuid)
  } catch (e) {
    console.error('Failed to save user UUID to storage', e)
  }
}

/**
 * Retrieves the user's UUID from AsyncStorage.
 * @returns A promise that resolves with the UUID string or null if not found.
 */
export const getUserUUID = async (): Promise<string | null> => {
  return AsyncStorage.getItem(USER_UUID_KEY)
}

/**
 * Removes the user's UUID from AsyncStorage.
 */
export const removeUserUUID = async (): Promise<void> => {
  return AsyncStorage.removeItem(USER_UUID_KEY)
}
