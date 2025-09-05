export interface AuthCredentials {
  email: string
  password: string
  passwordRepeat?: string // Optional because login doesn't need it
}
