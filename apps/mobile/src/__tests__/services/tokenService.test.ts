import { saveToken, getToken, removeToken } from '@/services/auth/tokenService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AUTH_TOKEN_KEY } from '@/constants/storageKeys'

// Mock the entire AsyncStorage module.
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

describe('tokenService', () => {
  // Clear all mocks before each test to ensure isolation.
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should save the token using AsyncStorage', async () => {
    const mockToken = 'test-token-123'
    await saveToken(mockToken)

    // Expect setItem to have been called with the correct key and value.
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY, mockToken)
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
  })

  it('should get the token from AsyncStorage', async () => {
    const mockToken = 'test-token-123'
    // Configure the mock to return a value when getItem is called.
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockToken)

    const token = await getToken()

    expect(token).toBe(mockToken)
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY)
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1)
  })

  it('should remove the token from AsyncStorage', async () => {
    await removeToken()

    // Expect removeItem to have been called with the correct key.
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY)
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1)
  })
})
