import { AddTask } from '@/components/AddTask'
import { HomeDrawer } from '@/components/HomeDrawer'
import { NavBar } from '@/components/NavBar'
import { Dictionary, Locale } from '@/i18n'
import { PageTitle } from '@repo/ui/components/page-title'

interface Props {
  locale: Locale
  t: Dictionary
}

function TasksPage({ locale, t }: Props) {
  return (
    <div>
      <HomeDrawer t={t} locale={locale}>
        <div>
          <NavBar locale={locale} />
          <div className="flex p-4">
            <div className="mx-auto h-20 w-full max-w-[800px]">
              <PageTitle>{t.home.title}</PageTitle>
              <div className="mt-4">
                <AddTask t={t} />
              </div>
            </div>
          </div>
        </div>
      </HomeDrawer>
    </div>
  )
}

export { TasksPage }
