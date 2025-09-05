import { AuthResponse } from '@/interfaces/auth-response.interface'
import { AuthCredentials } from '@/interfaces/auth-credentials.interface'
import { ApiHandler } from '../apiHandler'
import { AuthPaths } from '@/constants/apiPaths'
import { ChangePasswordDto } from '@/interfaces/auth/change-password.dto'

/**
 * The authentication endpoints, validated once when the module is loaded.
 * This implements a "fail-fast" strategy, ensuring the application won't run
 * with an invalid service configuration.
 */
const { EXPO_PUBLIC_API_AUTH: AUTH_ENDPOINT } = process.env

if (!AUTH_ENDPOINT) {
  throw new Error(
    'One or more authentication API endpoints are not defined in environment variables.',
  )
}

/**
 * Registers a new user with the provided credentials.
 * @param {AuthCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} A promise that resolves to an object containing the auth token and client data.
 */
export const register = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  return ApiHandler.post<AuthCredentials, AuthResponse>(
    `${AUTH_ENDPOINT}${AuthPaths.REGISTER}`,
    credentials,
  )
}

/**
 * Logs in a user with the provided credentials.
 * @param {AuthCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} A promise that resolves to an object containing the auth token and client data.
 */
export const login = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  return ApiHandler.post<AuthCredentials, AuthResponse>(
    `${AUTH_ENDPOINT}${AuthPaths.LOGIN}`,
    credentials,
  )
}

export const changePassword = async (
  passwordData: ChangePasswordDto,
): Promise<void> => {
  // We specify that the request body is a 'ChangePasswordDto'
  // and the expected response is 'void' (nothing).
  return ApiHandler.post<ChangePasswordDto, void>(
    `${AUTH_ENDPOINT}${AuthPaths.CHANGE_PASSWORD}`,
    passwordData,
  )
}

export const passwordReset = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  return ApiHandler.post<AuthCredentials, AuthResponse>(
    `${AUTH_ENDPOINT}${AuthPaths.RESET_PASSWORD}`,
    credentials,
  )
}
