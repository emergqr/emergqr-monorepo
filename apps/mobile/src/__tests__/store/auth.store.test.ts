import * as serviceMocks from '@/__mocks__/serviceMocks'
import { mockClient, mockToken } from '@/__mocks__/mockData'
import { act } from '@testing-library/react-native'

// Define the type for the store hook for cleaner type annotations later.
type UseAuthStoreType = typeof import('@/store/auth/auth.store').useAuthStore

// Mockea los servicios de los que depende el store de autenticación.
// Esto asegura que cuando el store llame a funciones como `login` o `getToken`,
// se ejecuten nuestras funciones mock en lugar de las implementaciones reales.
jest.mock('@/services/auth/authService', () => {
  // Usamos una ruta relativa porque el alias '@/' puede no estar disponible
  // en el contexto de la fábrica de mocks de Jest.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceMocks = require('../../__mocks__/serviceMocks')
  return {
    login: serviceMocks.mockedLogin,
    register: serviceMocks.mockedRegister,
    getProfile: serviceMocks.mockedGetProfile,
  }
})

jest.mock('@/services/auth/tokenService', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceMocks = require('../../__mocks__/serviceMocks')
  return {
    saveToken: serviceMocks.mockedSaveToken,
    getToken: serviceMocks.mockedGetToken,
    removeToken: serviceMocks.mockedRemoveToken,
  }
})

jest.mock('@/services/apiErrors', () => ({
  getApiErrorMessage: (error: unknown) => {
    // For tests, we want to bypass the logic of getApiErrorMessage
    // and just return the raw error message from our mocks.
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  },
}))

// Mock ApiHandler to prevent its module-level code (like the env var check) from running.
// The store's responsibility is to call ApiHandler.setAuthToken, not to know its implementation.
// This isolates the store completely for a true unit test.
jest.mock('@/services/apiHandler')

describe('useAuthStore', () => {
  // This will hold the store hook, dynamically imported in beforeEach.
  let useAuthStore: UseAuthStoreType
  // We also need a reference to the mocked ApiHandler to assert its methods are called.
  let ApiHandler: jest.Mocked<typeof import('@/services/apiHandler').ApiHandler>
  // To avoid repeated requires, we'll load the initial state once.
  let initialAuthState: typeof import('@/store/auth/auth.store').initialAuthState

  beforeEach(async () => {
    // Since all dependencies are mocked, we no longer need to set environment variables.
    jest.resetModules()
    // Dynamically import the store and its mocked dependencies *after* resetting modules.
    const authStoreModule = await import('@/store/auth/auth.store')
    useAuthStore = authStoreModule.useAuthStore
    initialAuthState = authStoreModule.initialAuthState
    ApiHandler = (await import('@/services/apiHandler')).ApiHandler

    // Reset the store to its initial state using the exported, clean state object.
    useAuthStore.setState(authStoreModule.initialAuthState)
    // Clear all previous mock calls and implementations
    jest.clearAllMocks()
  })

  it('should have the correct initial state', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  describe('signIn', () => {
    it('should handle successful login', async () => {
      // Arrange: Set up the mock to return a successful response
      serviceMocks.mockedLogin.mockResolvedValue({
        access_token: mockToken,
        client: mockClient,
      })

      // Act: Call the action
      // Use act to ensure all state updates are processed before assertions
      await act(async () => {
        await useAuthStore
          .getState()
          .signIn({ email: 'test@example.com', password: 'password' })
      })

      // Assert: Check if the state was updated correctly
      expect(useAuthStore.getState()).toMatchObject({
        isAuthenticated: true,
        user: mockClient,
        token: mockToken,
        error: null,
        isLoading: false,
      })
      expect(serviceMocks.mockedSaveToken).toHaveBeenCalledWith(mockToken)
      expect(ApiHandler.setAuthToken).toHaveBeenCalledWith(mockToken)
    })

    it('should handle failed login', async () => {
      // Arrange: Set up the mock to throw an error
      const errorMessage = 'Invalid credentials'
      serviceMocks.mockedLogin.mockRejectedValue(new Error(errorMessage))

      // Act & Assert: Call the action and expect it to throw an error
      // Use act for async state updates and wrap the call in a function for rejects.toThrow
      await act(async () => {
        await expect(
          useAuthStore
            .getState()
            .signIn({ email: 'test@example.com', password: 'wrong-password' }),
        ).rejects.toThrow(errorMessage)
      })

      // Assert: Check if the state reflects the failure
      // The state should be reset to initial, but with the error message.
      expect(useAuthStore.getState()).toEqual({
        ...initialAuthState,
        error: errorMessage,
      })
      expect(ApiHandler.setAuthToken).not.toHaveBeenCalled()
    })
  })

  describe('signUp', () => {
    it('should handle successful registration and login', async () => {
      // Arrange
      serviceMocks.mockedRegister.mockResolvedValue({
        access_token: mockToken,
        client: mockClient,
      })

      // Act
      await act(async () => {
        await useAuthStore
          .getState()
          .signUp({ email: 'new@example.com', password: 'new-password' })
      })

      // Assert
      expect(useAuthStore.getState()).toMatchObject({
        isAuthenticated: true,
        user: mockClient,
        token: mockToken,
      })
      expect(serviceMocks.mockedSaveToken).toHaveBeenCalledWith(mockToken)
      expect(ApiHandler.setAuthToken).toHaveBeenCalledWith(mockToken)
    })

    it('should handle failed registration', async () => {
      // Arrange
      const errorMessage = 'Email already in use'
      serviceMocks.mockedRegister.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await act(async () => {
        await expect(
          useAuthStore
            .getState()
            .signUp({ email: 'test@example.com', password: 'password' }),
        ).rejects.toThrow(errorMessage)
      })

      // Assert
      expect(useAuthStore.getState()).toEqual({
        ...initialAuthState,
        error: errorMessage,
      })
    })
  })

  describe('signOut', () => {
    it('should clear user data and token on sign out', async () => {
      // Arrange: First, simulate a logged-in state
      useAuthStore.setState({
        isAuthenticated: true,
        user: mockClient,
        token: mockToken,
      })

      // Act: Call the sign out action
      await act(async () => {
        await useAuthStore.getState().signOut()
      })

      // Assert: Check if the state has been reset
      expect(useAuthStore.getState()).toEqual(initialAuthState)
      expect(serviceMocks.mockedRemoveToken).toHaveBeenCalled()
      expect(ApiHandler.setAuthToken).toHaveBeenCalledWith(null)
    })
  })

  describe('checkAuthStatus', () => {
    it('should authenticate user if a valid token is found', async () => {
      // Arrange
      serviceMocks.mockedGetToken.mockResolvedValue(mockToken)
      serviceMocks.mockedGetProfile.mockResolvedValue(mockClient)

      // Act
      await act(async () => {
        await useAuthStore.getState().checkAuthStatus()
      })

      // Assert
      expect(useAuthStore.getState()).toMatchObject({
        isAuthenticated: true,
        user: mockClient,
        token: mockToken,
        isLoading: false,
      })
      expect(ApiHandler.setAuthToken).toHaveBeenCalledWith(mockToken)
    })

    it('should not authenticate if no token is found', async () => {
      // Arrange
      serviceMocks.mockedGetToken.mockResolvedValue(null)

      // Act
      await act(async () => {
        await useAuthStore.getState().checkAuthStatus()
      })

      // Assert
      expect(useAuthStore.getState()).toEqual(initialAuthState)
      expect(serviceMocks.mockedGetProfile).not.toHaveBeenCalled()
    })

    it('should not authenticate if token is invalid (getProfile fails)', async () => {
      // Arrange
      serviceMocks.mockedGetToken.mockResolvedValue(mockToken)
      serviceMocks.mockedGetProfile.mockRejectedValue(
        new Error('Invalid token'),
      )

      // Act
      await act(async () => {
        await useAuthStore.getState().checkAuthStatus()
      })

      // Assert
      expect(useAuthStore.getState()).toEqual(initialAuthState)
      expect(serviceMocks.mockedRemoveToken).toHaveBeenCalled()
    })
  })
})
