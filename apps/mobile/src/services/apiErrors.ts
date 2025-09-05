import { isAxiosError } from 'axios'

/**
 * Custom error class for handling API-specific errors.
 * It extends the native Error class to include an HTTP status code.
 */
export class ApiError extends Error {
  /** The HTTP status code of the API response. */
  status: number

  /**
   * Creates an instance of ApiError.
   * @param {string} message - The error message.
   * @param {number} status - The HTTP status code.
   */
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Interprets a caught error and returns a user-friendly message.
 * This function handles both custom `ApiError` instances and other unknown errors.
 * @param {unknown} error - The error object caught in a try-catch block.
 * @returns {string} A user-friendly error message.
 */
export const getApiErrorMessage = (error: unknown): string => {
  // The most common case: an error from an Axios API call.
  if (isAxiosError(error)) {
    // Case 1: The server responded with a status code (4xx, 5xx)
    if (error.response) {
      // Handle specific known error codes for better UX
      if (error.response.status === 401) {
        return 'Your session has expired. Please log in again.'
      }
      if (error.response.status === 404) {
        return 'The requested resource was not found on the server.'
      }
      // For other server errors, try to use the message from the backend response.
      // The backend might send errors in a { detail: '...' } or { message: '...' } structure.
      const serverMessage =
        error.response.data?.detail || error.response.data?.message
      return serverMessage || `Server error: ${error.response.status}`
    }

    // Case 2: The request was made but no response was received (Network Error)
    // This happens with no internet, backend is down, or CORS issues in web.
    if (error.request) {
      return 'Could not connect to the server. Please check your internet connection and try again.'
    }
  }

  // Case 3: A standard JavaScript Error object
  if (error instanceof Error) {
    return error.message
  }

  // Fallback for any other unknown error type
  console.error('Non-API error:', error)
  return 'Could not connect to the server. Please check your internet connection.'
}
