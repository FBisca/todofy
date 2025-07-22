import { getDictionary, Locale } from '@/i18n'
import { HomePage } from '@/pages/HomePage'

type Props = {
  params: Promise<{ locale: Locale }>
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const t = await getDictionary(locale)
  return <HomePage t={t} />
}
