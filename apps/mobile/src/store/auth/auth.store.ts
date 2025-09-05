import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '@/services/api'
import { getApiErrorMessage } from '@/services/apiErrors'
import { saveToken, removeToken, getToken } from '@/services/auth/tokenService'
import {
  saveUserUUID,
  removeUserUUID,
  getUserUUID,
} from '@/services/auth/userUUIDService'
import { AuthResponse } from '../../../../../packages/core/src/domain/interfaces/auth-response.interface'
import { ChangePasswordDto } from '../../../../../packages/core/src/domain/interfaces/auth/change-password.dto'
import { RegisterPayload } from '../../../../../packages/core/src/domain/interfaces/auth/register-payload.interface'
import { AuthCredentials } from '../../../../../packages/core/src/domain/interfaces/auth-credentials.interface'
import { Client } from '../../../../../packages/core/src/domain/interfaces/client/client.interface'
import { useNetworkStore } from '../network/network.store'

/**
 * Defines the shape of the state properties.
 */
interface State {
  user: Client | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Defines the shape of the actions available in the store.
 */
interface Actions {
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (payload: RegisterPayload) => Promise<void>
  signOut: () => Promise<void>
  changePassword: (passwordData: ChangePasswordDto) => Promise<void>
  checkAuthStatus: () => Promise<void>
  setUser: (user: Client) => void
}

/**
 * The initial state shape for the authentication store.
 * This is exported to allow for easy resetting in tests and for type inference.
 */
export const initialAuthState: State = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

/**
 * Zustand store for managing authentication state and actions.
 */
export const useAuthStore = create<State & Actions>((set) => {
  /**
   * A private helper function to handle the common logic for successful authentication.
   * It saves the token, sets it in the ApiHandler, and updates the store state.
   * @param {AuthResponse} response - The response object from a successful login or register call.
   */
  const handleAuthSuccess = async (response: AuthResponse) => {
    const { access_token: token, client } = response

    // Verificación de seguridad: El UUID es esencial. Si no viene, es un error.
    if (!client?.uuid) {
      const errorMessage = 'Authentication response is missing user UUID.'
      set({ ...initialAuthState, error: errorMessage })
      throw new Error(errorMessage)
    }

    await saveToken(token)
    await saveUserUUID(client.uuid)
    set({
      user: client,
      token,
      isAuthenticated: true,
      error: null,
      isLoading: false,
    })
  }

  /**
   * A private helper to handle the common logic for failed authentication.
   * It sets the error state and re-throws the error for the UI to catch.
   * @param {unknown} error - The error caught from the service call.
   */
  const handleAuthFailure = (error: unknown) => {
    const errorMessage = getApiErrorMessage(error)
    // Reset state but preserve the new error message.
    set({ ...initialAuthState, error: errorMessage })
    throw new Error(errorMessage)
  }

  return {
    ...initialAuthState,
    signIn: async (credentials: AuthCredentials) => {
      set({ isLoading: true, error: null })
      try {
        const response = await api.post<AuthResponse>(
          '/auth/login',
          credentials,
        )
        await handleAuthSuccess(response.data)
      } catch (error) {
        handleAuthFailure(error)
      }
    },

    signUp: async (payload: RegisterPayload) => {
      set({ isLoading: true, error: null })
      try {
        const response = await api.post<AuthResponse>('/auth/register', payload)
        await handleAuthSuccess(response.data)
      } catch (error) {
        handleAuthFailure(error)
      }
    },

    changePassword: async (passwordData: ChangePasswordDto) => {
      set({ isLoading: true, error: null })
      try {
        await api.post('/auth/change-password', passwordData)
        set({ isLoading: false })
      } catch (error) {
        handleAuthFailure(error)
      }
    },

    signOut: async () => {
      await removeToken()
      await removeUserUUID() // Eliminamos el UUID guardado
      await AsyncStorage.removeItem('offline_qr_data') // Limpiamos el QR guardado para uso offline
      // Reset the store to its initial, unauthenticated state.
      set(initialAuthState)
    },

    checkAuthStatus: async () => {
      set({ isLoading: true })
      const token = await getToken()
      const isOnline = useNetworkStore.getState().isOnline

      if (!token) {
        set(initialAuthState) // No hay token, no está autenticado
        return
      }

      // Si hay token, intentamos obtener el perfil completo desde la red
      try {
        const response = await api.get<Client>('/clients/me/profile')
        const userProfile = response.data

        // Verificación de seguridad: Si el perfil no tiene UUID, algo anda mal.
        if (!userProfile?.uuid) {
          // Esto podría pasar si el token es válido pero hay un problema en la base de datos.
          throw new Error('User profile is missing UUID.')
        }

        await saveUserUUID(userProfile.uuid) // Re-guardamos por si acaso
        set({
          user: userProfile,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        // La llamada a la API falló. Verificamos si es por estar offline.
        if (!isOnline) {
          console.log(
            'App is offline. Attempting to load user from UUID for QR mode.',
          )
          const cachedUUID = await getUserUUID()
          if (cachedUUID) {
            // Creamos un objeto de usuario parcial solo con el UUID
            const partialUser: Partial<Client> = { uuid: cachedUUID }
            set({
              user: partialUser as Client,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            // Offline y sin UUID cacheado, no podemos hacer nada.
            set(initialAuthState)
          }
        } else {
          // Hubo un error de red (ej. token inválido) estando online. Deslogueamos.
          await removeToken()
          await removeUserUUID()
          set(initialAuthState)
        }
      }
    },

    setUser: (user: Client) => set({ user }),
  }
})
