import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
// Se ha actualizado la ruta para que apunte al archivo local.
import { a_languages, LanguageCode } from './constants/languages'

/**
 * Statically require all translation files.
 */
const translations = {
  // Se han actualizado las rutas para que apunten a los archivos locales.
  en: require('./locales/en.json'),
  es: require('./locales/es.json'),
}

const resources = a_languages.reduce(
  (acc, lang) => {
    acc[lang.code] = { translation: translations[lang.code] }
    return acc
  },
  {} as Record<LanguageCode, { translation: Record<string, unknown> }>,
)

const supportedLngs = a_languages.map((lang) => lang.code)

/**
 * Determines the best initial language for the app.
 */
const getInitialLanguage = (): LanguageCode => {
  const deviceLang = Localization.getLocales()[0]?.languageCode?.split('-')[0]
  if (deviceLang && (supportedLngs as string[]).includes(deviceLang)) {
    return deviceLang as LanguageCode
  }
  return 'en' // Default fallback language
}

/**
 * Initializes the i18next internationalization library.
 */
i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  supportedLngs: supportedLngs,
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
