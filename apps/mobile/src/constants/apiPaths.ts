/**
 * Centralized API path segments to avoid magic strings and ensure consistency.
 */

export const AuthPaths = {
  REGISTER: '/register',
  LOGIN: '/login',
  CHANGE_PASSWORD: '/change-password',
  RESET_PASSWORD: '/reset-password',
}

export const ClientPaths = {
  PROFILE: '/profile',
  AVATAR: '/avatar',
  CONTACTS: '/contacts',
  ADMIN_STATUS: '/admin-status',
}

export const AddressPaths = {
  BASE: '/',
  BY_UUID: (uuid: string) => `/${uuid}`,
}

export const ContactPaths = {
  BASE: '/',
  BY_UUID: (uuid: string) => `/${uuid}`,
}

export const EmergDataPaths = {
  BASE: '/emerg-data/',
  ME: '/emerg-data/me',
}
