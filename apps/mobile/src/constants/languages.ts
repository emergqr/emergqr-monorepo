// src/constants/languages.ts
export const a_languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  // Cuando quieras añadir francés:
  // { code: 'fr', name: 'Français' },
] as const

export type Language = (typeof a_languages)[number]
export type LanguageCode = Language['code']
