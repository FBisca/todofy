import { getDictionary, Locale } from '@/i18n'
import ArchivedTasksPage from '@/ui/pages/ArchivedTasksPage'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  const t = await getDictionary(locale)
  return <ArchivedTasksPage t={t} />
}
