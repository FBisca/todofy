import { getDictionary, Locale } from '@/i18n'
import TasksPage from '@/pages/TasksPage'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const t = await getDictionary(locale)
  return <TasksPage t={t} />
}
