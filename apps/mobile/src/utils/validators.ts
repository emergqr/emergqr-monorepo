/**
 * Validates if a given string is a valid email address.
 * @param {string} email - The string to validate.
 * @returns {boolean} `true` if the email is valid, `false` otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false
  // A simple regex for email validation.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates if a password meets the security criteria.
 * Criteria: 8-64 characters, at least one uppercase letter, one lowercase letter,
 * one number, and one special character from the set: $%&-.?¡¿!+_
 * @param {string} password - The password string to validate.
 * @returns {boolean} `true` if the password is valid, `false` otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false
  const passeRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$%&\-.?¡¿!+_])[a-zA-Z\d$%&\-.?¡¿!+_]{8,64}$/
  return passeRegex.test(password)
}
