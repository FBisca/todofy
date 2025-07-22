import { Locale } from './i18n'

export const routes = (locale: Locale) => {
  function buildRoute(route: string) {
    return `/${locale}${route}`
  }

  return {
    tasks: () => buildRoute('/'),
    completed: () => buildRoute('/completed'),
    archived: () => buildRoute('/archived'),
  }
}
