import axios from 'axios'

/**
 * Lee la URL base de la API directamente desde las variables de entorno.
 * Expo se encarga de cargar el archivo .env.development y hacer que esta variable
 * esté disponible globalmente a través de process.env.
 */
const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL

// Un log para depuración que confirma que la URL se está cargando correctamente.
console.log(`[API] Cliente Axios inicializado con baseURL: ${baseURL}`)

if (!baseURL) {
  console.error(
    '¡Error Crítico! La variable EXPO_PUBLIC_API_BASE_URL no está definida. Revisa tus archivos .env',
  )
}

const api = axios.create({
  // La variable ya contiene la ruta completa, incluyendo /api/v1.
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

// import axios from 'axios';
// import Constants from 'expo-constants';
//
// /**
//  * Obtiene la URL base de la API desde las variables de entorno de Expo.
//  * Asegúrate de tener API_BASE_URL definida en tu archivo app.config.ts o eas.json.
//  */
// export const getApiBaseUrl = (): string => {
//     const baseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;
//     if (!baseUrl || typeof baseUrl !== 'string') {
//         throw new Error(
//             'API_BASE_URL no está definida o no es válida en app.config.ts. Por favor, revisa tu configuración.',
//         );
//     }
//     return baseUrl;
// };
//
// const api = axios.create({
//   // Añadimos el prefijo /api/v1 a la URL base.
//   baseURL: `${getApiBaseUrl().replace(/\/$/, '')}/api/v1`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
//
// export default api;
