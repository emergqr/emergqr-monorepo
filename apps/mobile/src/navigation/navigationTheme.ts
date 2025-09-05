import { Theme } from '@react-navigation/native'
import { colors } from '@/constants/color'

/**
 * Mapea nuestros objetos de colores personalizados al formato de tema
 * que espera React Navigation. Esto asegura una integración visual
 * consistente en toda la aplicación.
 */
export const AppNavigationTheme = {
  light: {
    dark: false,
    colors: {
      primary: colors.light.primary,
      background: colors.light.background,
      card: colors.light.card,
      text: colors.light.text,
      border: colors.light.border,
      notification: colors.light.alert, // Usamos el color de alerta para notificaciones
    },
  } as Theme,
  dark: {
    dark: true,
    colors: {
      primary: colors.dark.primary,
      background: colors.dark.background,
      card: colors.dark.card,
      text: colors.dark.text,
      border: colors.dark.border,
      notification: colors.dark.alert,
    },
  } as Theme,
}
