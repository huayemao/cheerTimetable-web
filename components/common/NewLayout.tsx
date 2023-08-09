import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactElement } from 'react'
import { Logo } from '../Logo'
// import { HeaderTitle } from './HeaderTitle'
import { NavLink } from './NavLink'
import { SideBarSearch } from './SideBarSearch'
const HeaderTitle = dynamic(() => import('./HeaderTitle'), {
  // Do not import in server side
  ssr: false,
})
export type Props = {
  children: ReactElement
  navSection?: ReactElement
  title?: ReactElement
}

export function NewLayout({ children, navSection, title }: Props) {
  function Header() {
    return (
      <header className="space-around sticky top-0 z-[10]  flex h-16 w-full items-center border-b border-b-slate-200 text-slate-900 backdrop-blur-sm md:flex-row">
        <div className="md:flex-[1] absolute  left-0 flex h-full w-20 items-center text-center md:static">
          {/* 这个内容叫什么？ yari 的 css 类名叫 top-navigation-wrap */}
          {navSection || (
            <Link
              href={'/'}
              className="whitespace-nowrap flex gap-2 drop-shadow-lg shadow-primary-500 items-center ml-4 text-center text-2xl lg:text-4xl font-semibold  md:ml-8"
            >
              <Logo />
              {/* <span className="font-sans">cheer</span> */}
            </Link>
          )}
        </div>
        <div className="flex w-0 flex-[4] gap-4">
          {title ?? (
            <h1
              id="headerContent"
              className="text-center text-2xl text-slate-600 w-full line-clamp-1"
            >
              <HeaderTitle />
            </h1>
          )}
        </div>
      </header>
    )
  }

  return (
    <div className="min-h-screen w-full   text-slate-800">
      <Header />
      <div className="grid w-full grid-cols-1 md:grid-cols-5">
        <Sidebar />
        <main className="col-span-4 mb-12 h-full min-h-[calc(100vh-4rem)] bg-slate-50 md:mb-0 md:py-2 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="md:h-[calc(100vh-4rem)] top-16 col-span-1 row-span-4 hidden space-y-2 border-gray-200 md:sticky md:block md:border-r md:p-4">
      {/* todo: 这个搜索框如何 SSR 化？ ? */}
      {<SideBarSearch />}
      {<NavLink />}
      {/* <p className="fixed bottom-0 p-4 text-sm">
        花野猫筑之以 ❤
        <br />
        赏他一碗米线
      </p> */}
    </aside>
  )
}
