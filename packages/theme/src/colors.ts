import { ThemeColors } from '@emergqr/core/src/domain/interfaces/ThemeColors.interface'

/**
 * Paleta de colores comunes para evitar la repetición.
 */
const commonColors = {
  white: '#FFFFFF',
  black: '#000000',
  blueGreen: '#5d979e', // Color primario de app.json
  red: '#d9534f',
  softRed: '#dd7272',
  darkSoftRed: '#4d2222',
  green: '#5cb85c',
  surfGreen: '#3f673f',
  surfOrange: '#f59e0b',
  // Tonos de gris
  gray50: '#f9fafb', // Muy claro, para fondos de inputs en tema claro
  gray100: '#f3f4f6', // Para fondos neutrales en tema claro
  gray200: '#e5e7eb', // Para bordes en tema claro
  gray400: '#9ca3af', // Para placeholders en tema claro
  gray500: '#6b7280', // Texto secundario
  gray700: '#374151', // Para fondos de inputs en tema oscuro
  gray800: '#1f2937', // Para tarjetas en tema oscuro
  gray900: '#111827', // Para fondo principal en tema oscuro
}

/**
 * Definición del tema claro.
 * Implementa la interfaz `ThemeColors` para asegurar que todas las propiedades estén definidas.
 */
const light: ThemeColors = {
  // Base
  surface: commonColors.surfOrange,
  primary: commonColors.blueGreen,
  primaryText: commonColors.white,
  secondary: commonColors.gray500,
  background: commonColors.gray50,
  card: commonColors.white,
  text: commonColors.gray900,
  secondaryText: commonColors.gray500,
  onSurfaceVariant: commonColors.gray500, // Color para etiquetas y texto de medio énfasis
  border: commonColors.gray200,
  // Estado
  success: commonColors.green,
  alert: commonColors.red,
  alertSoft: commonColors.softRed,
  disabled: commonColors.gray200,
  // UI
  inputBackground: commonColors.white, // En tema claro, los inputs suelen ser blancos
  placeholder: commonColors.gray400,
  neutral: commonColors.gray100,
  tabIconDefault: '#ccc',
  tabIconSelected: commonColors.blueGreen,
}

/**
 * Definición del tema oscuro.
 */
const dark: ThemeColors = {
  // Base
  surface: commonColors.surfOrange,
  primary: commonColors.blueGreen,
  primaryText: commonColors.white,
  secondary: commonColors.gray400,
  background: commonColors.gray900,
  card: commonColors.gray800,
  text: commonColors.gray50,
  secondaryText: commonColors.gray400,
  onSurfaceVariant: commonColors.gray400, // Color para etiquetas y texto de medio énfasis
  border: commonColors.gray700,
  // Estado
  success: commonColors.green,
  alert: commonColors.red,
  alertSoft: commonColors.darkSoftRed,
  disabled: commonColors.gray700,
  // UI
  inputBackground: commonColors.gray700,
  placeholder: commonColors.gray500,
  neutral: commonColors.gray800,
  tabIconDefault: '#ccc',
  tabIconSelected: commonColors.blueGreen,
}

export const colors = {
  light,
  dark,
}
