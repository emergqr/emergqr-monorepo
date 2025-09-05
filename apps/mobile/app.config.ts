export default {
  expo: {
    name: 'EmergQR',
    slug: 'EmergQR',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icon.png',
    scheme: 'emergqr-app',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './src/assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#5d979e',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      // Añadimos el identificador único para iOS.
      bundleIdentifier: 'com.jac.emergqr',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/adaptive-icon.png',
        backgroundColor: '#5d979e',
      },
      // Añadimos el identificador único para Android.
      // Puedes cambiar "jac" por el nombre de tu empresa o desarrollador.
      package: 'com.jac.emergqr',
      // Permitir tráfico HTTP en texto plano para desarrollo local (Android)
      usesCleartextTraffic: true,
      edgeToEdgeEnabled: false,
    },
    web: {
      favicon: './src/assets/favicon.png',
    },
    plugins: ['expo-font', 'expo-localization'],
    // Aquí definimos nuestras variables de entorno personalizadas.
    // extra: {
    // process.env.API_BASE_URL se poblará desde tu archivo .env para producción.
    // Para desarrollo local, usamos un fallback.
    //
    // ¡¡¡IMPORTANTE!!!: Asegúrate de que esta IP sea la dirección IP local actual de tu computadora.
    //   API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.1.42:8051',
    // },
  },
}
