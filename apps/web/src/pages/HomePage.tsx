import { Dictionary } from '@/i18n'
import { HomeDrawer } from '@repo/ui/components/home-drawer'
import { NavBar } from '@repo/ui/components/nav-bar'
import { PageTitle } from '@repo/ui/components/page-title'

interface Props {
  t: Dictionary
}

function HomePage({ t }: Props) {
  return (
    <div>
      <HomeDrawer>
        <div>
          <NavBar />
          <div className="flex p-4">
            <div className="mx-auto h-20 w-full max-w-[800px]">
              <PageTitle>{t.home.title}</PageTitle>
            </div>
          </div>
        </div>
      </HomeDrawer>
    </div>
  )
}

export { HomePage }
