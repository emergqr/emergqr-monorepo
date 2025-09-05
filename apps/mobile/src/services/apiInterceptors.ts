import api from './api'
import { getApiErrorMessage } from './apiErrors'
import { i18n as i18nInstanceType } from 'i18next' // Importamos el tipo de i18n

/**
 * Configura los interceptores de Axios para la aplicación.
 * Esta función debe ser llamada una sola vez cuando la aplicación se inicializa.
 * @param getTokenFn Función para obtener el token de autenticación.
 * @param signOutFn Función para cerrar la sesión del usuario.
 * @param i18nInstance Instancia de i18n para obtener el idioma actual.
 */
export const setupApiInterceptors = (
  getTokenFn: () => Promise<string | null>,
  signOutFn: () => Promise<void>,
  i18nInstance: i18nInstanceType,
) => {
  /**
   * Interceptor de Petición:
   * Se ejecuta antes de que cada petición sea enviada.
   * Inyecta las cabeceras de Authorization y Accept-Language.
   */
  api.interceptors.request.use(
    async (config) => {
      // Hacemos el interceptor asíncrono para usar await getTokenFn()
      const token = await getTokenFn()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      const language = i18nInstance.language
      if (language) {
        config.headers['Accept-Language'] = language
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  /**
   * Interceptor de Respuesta:
   * Se ejecuta cuando se recibe una respuesta (exitosa o con error).
   */
  api.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, la devolvemos tal cual
    (error) => {
      const errorMessage = getApiErrorMessage(error)
      // Si el token es inválido o ha expirado (401), deslogueamos al usuario.
      if (error.response?.status === 401) {
        signOutFn() // Llamamos a la función de signOut proporcionada
      }
      // Rechazamos la promesa con un mensaje de error amigable para el usuario.
      return Promise.reject(new Error(errorMessage))
    },
  )
}
