const config = {
  defaultLocale: 'en',
  locales: ['en', 'es'],
} as const;

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};

const defaultDictionary = dictionaries.en;

type Locale = (typeof config)['locales'][number];
const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? defaultDictionary();

export interface DictionaryProps {
  params: Promise<{ locale: Locale }>;
}

export default {
  config,
  getDictionary,
};

export type { Locale };
