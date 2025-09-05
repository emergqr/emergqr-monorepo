import { Client } from 'packages/core/src/domain/interfaces/client/client.interface'
import { AuthCredentials } from 'packages/core/src/domain/interfaces/auth-credentials.interface'
import { RegisterPayload } from './register-payload.interface'

export interface AuthState {
  user: Client | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (payload: RegisterPayload) => Promise<void>
  signOut: () => void
  checkAuthStatus: () => Promise<void>
}
