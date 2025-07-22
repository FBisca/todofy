const config = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
} as const

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
}

type Locale = (typeof config)['locales'][number]

const defaultDictionary = dictionaries.en
const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? defaultDictionary()

type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export { getDictionary }
export type { Dictionary, Locale }

export default config
