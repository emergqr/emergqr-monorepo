import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import { a_languages, LanguageCode } from '@/constants/languages'

/**
 * Statically require all translation files.
 * Metro bundler needs this to include the files in the build.
 * A fully dynamic require() is not supported.
 */
const translations = {
  en: require('../locales/en.json'),
  es: require('../locales/es.json'),
  // When adding a new language, add its require statement here.
  // e.g., fr: require('../locales/fr.json'),
}

// Se ha reemplazado 'any' por un tipo más seguro para el contenido del JSON.
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
 * It checks the device's primary language and sees if it's one of the supported languages.
 * It handles regional codes (e.g., 'es-MX' becomes 'es').
 * If the device language is not supported, it defaults to 'en'.
 * @returns {LanguageCode} The determined initial language code.
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
  // Required for React Native compatibility.
  compatibilityJSON: 'v3',
  interpolation: {
    // React already handles escaping, so we can disable it here.
    escapeValue: false,
  },
})

export default i18n
