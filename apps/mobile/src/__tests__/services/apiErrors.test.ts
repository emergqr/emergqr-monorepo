import { ApiError, getApiErrorMessage } from '@/services/apiErrors'

describe('getApiErrorMessage', () => {
  // Mock console.error to prevent logging during tests and to spy on it.
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should return the message from an ApiError', () => {
    const apiError = new ApiError('User not found', 404)
    expect(getApiErrorMessage(apiError)).toBe('User not found')
  })

  it('should return a specific message for a 401 ApiError', () => {
    const unauthorizedError = new ApiError('Token expired', 401)
    expect(getApiErrorMessage(unauthorizedError)).toBe(
      'Your session has expired. Please log in again.',
    )
  })

  it('should return a generic message for non-ApiError errors and log them', () => {
    const genericError = new Error('Network failed')
    expect(getApiErrorMessage(genericError)).toBe(
      'Could not connect to the server. Please check your internet connection.',
    )
    // Verify that the original error was logged for debugging purposes.
    expect(consoleErrorSpy).toHaveBeenCalledWith('Non-API error:', genericError)
  })
})
