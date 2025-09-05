/**
 * Formats a Date object or a date string into the 'YYYY-MM-DD' format required by the API.
 * This function is robust and can handle Date objects, valid date strings, or null/undefined values.
 * @param date - The Date object or string to format.
 * @returns A formatted date string or null.
 */
export const formatDateForApi = (
  date: Date | string | null | undefined,
): string | null => {
  if (!date) {
    return null
  }

  // If the input is already a Date object, use it. Otherwise, try to parse the string.
  const dateObj = date instanceof Date ? date : new Date(date)

  // Check if the resulting date is valid. `new Date('invalid-string')` results in an invalid date.
  if (isNaN(dateObj.getTime())) {
    return null
  }

  // toISOString() returns 'YYYY-MM-DDTHH:mm:ss.sssZ', so we split at 'T' and take the first part to ensure UTC format.
  return dateObj.toISOString().split('T')[0]
}

/**
 * Formats a Date object or a date string into a user-friendly 'DD/MM/YYYY' format.
 * @param date - The Date object or string to format.
 * @returns A formatted date string or an empty string if the date is invalid.
 */
export const formatDateForDisplay = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    return ''
  }

  const dateObj = date instanceof Date ? date : new Date(date)

  if (isNaN(dateObj.getTime())) {
    return ''
  }

  // Use local date parts to avoid timezone issues in display.
  return dateObj.toLocaleDateString('es-ES') // Or use a library like date-fns for more control
}
