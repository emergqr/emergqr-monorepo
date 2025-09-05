// Mock the ApiHandler to prevent actual network calls.
jest.mock('@/services/apiHandler')

describe('authService', () => {
  // We need a reference to the mocked ApiHandler that we can update in each test.
  // The type is complex, but it correctly types our mocked class.
  let ApiHandler: jest.Mocked<typeof import('@/services/apiHandler').ApiHandler>

  // Save the original environment variables before any tests run.
  const originalLogin = process.env.EXPO_PUBLIC_API_LOGIN
  const originalRegister = process.env.EXPO_PUBLIC_API_REGISTER
  const originalProfile = process.env.EXPO_PUBLIC_API_CLIENT_PROFILE
  const originalApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL

  // Set up mock environment variables before each test.
  beforeEach(async () => {
    jest.resetModules() // Clears the cache
    jest.clearAllMocks() // Clears mock usage data (e.g., call counts)
    // After resetting modules, we need to re-import our mock to get a fresh reference
    // for our assertions. This ensures we're checking the same mock instance that the
    // service is using.
    ApiHandler = (await import('@/services/apiHandler')).ApiHandler

    // Crucially, we must also set the environment variables for the service's
    // dependencies. ApiHandler requires a base URL to load without throwing an error.
    // This makes this test suite self-contained and resilient.
    process.env.EXPO_PUBLIC_API_BASE_URL = 'http://mock-api.com'

    // Set the mock environment variables for the tests in this suite.
    process.env.EXPO_PUBLIC_API_LOGIN = '/auth/login'
    process.env.EXPO_PUBLIC_API_REGISTER = '/auth/register'
    process.env.EXPO_PUBLIC_API_CLIENT_PROFILE = '/clients/profile'
  })

  // Restore original environment variables after each test to ensure perfect isolation.
  afterEach(() => {
    process.env.EXPO_PUBLIC_API_LOGIN = originalLogin
    process.env.EXPO_PUBLIC_API_REGISTER = originalRegister
    process.env.EXPO_PUBLIC_API_CLIENT_PROFILE = originalProfile
    process.env.EXPO_PUBLIC_API_BASE_URL = originalApiBaseUrl
  })

  describe('when API endpoints are defined', () => {
    // By importing the service once in a beforeEach within this describe block,
    // we avoid repeating the import statement in every test, making them cleaner.
    let authService: typeof import('@/services/auth/authService')

    beforeEach(async () => {
      // This runs after the parent beforeEach, so modules are already reset
      // and environment variables are correctly set for this success context.
      authService = await import('@/services/auth/authService')
    })

    it('should call ApiHandler.post with correct endpoint and credentials for login', async () => {
      const credentials = { email: 'test@test.com', password: 'password' }
      await authService.login(credentials)

      expect(ApiHandler.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(ApiHandler.post).toHaveBeenCalledTimes(1)
    })

    it('should call ApiHandler.post with correct endpoint and credentials for register', async () => {
      const credentials = { email: 'test@test.com', password: 'password' }
      await authService.register(credentials)

      expect(ApiHandler.post).toHaveBeenCalledWith(
        '/auth/register',
        credentials,
      )
      expect(ApiHandler.post).toHaveBeenCalledTimes(1)
    })

    it('should call ApiHandler.get with correct endpoint for getProfile', async () => {
      await authService.getProfile()

      expect(ApiHandler.get).toHaveBeenCalledWith('/clients/profile')
      expect(ApiHandler.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('when API endpoints are missing', () => {
    const expectedError = new Error(
      'One or more authentication API endpoints are not defined in environment variables.',
    )

    // This table-driven test ensures that if any required environment variable is missing,
    // the corresponding service function will throw the expected error. This approach
    // avoids code duplication and covers all failure cases concisely.
    it.each([
      { envVar: 'EXPO_PUBLIC_API_LOGIN' },
      { envVar: 'EXPO_PUBLIC_API_REGISTER' },
      { envVar: 'EXPO_PUBLIC_API_CLIENT_PROFILE' },
    ])(
      'should throw an error on module load if $envVar is not defined',
      ({ envVar }) => {
        delete process.env[envVar as keyof NodeJS.ProcessEnv]
        jest.resetModules()

        // The error is thrown when the module is loaded, so we must use require()
        // to test this synchronous exception. Disabling the ESLint rule for this line.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        expect(() => require('@/services/auth/authService')).toThrow(
          expectedError,
        )
      },
    )
  })
})
