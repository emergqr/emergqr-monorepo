import { User } from './user.interface'
import { AuthCredentials } from './auth-credentials.interface'

/**
 * Represents the properties of the authentication state.
 */
interface AuthStateProperties {
  isLoading: boolean
  userToken: string | null
  user: User | null
  error: string | null
}

/**
 * Represents the actions available in the authentication store.
 */
interface AuthStateActions {
  signIn: (credentials: AuthCredentials) => Promise<void>
  signOut: () => Promise<void>
  signUp: (credentials: AuthCredentials) => Promise<void>
  restoreSession: () => Promise<void>
  clearError: () => void
}

/**
 * The complete authentication state, combining properties and actions for the Zustand store.
 */
export type AuthState = AuthStateProperties & AuthStateActions
