import { getDictionary, Locale } from '@/i18n'
import CompletedTasksPage from '@/ui/pages/CompletedTasksPage'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params

  const t = await getDictionary(locale)
  return <CompletedTasksPage t={t} />
}
