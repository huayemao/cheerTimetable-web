import clsx from 'clsx'
import { ReactChildren } from 'react'
import { HeaderTitle } from './HeaderTitle'
import { SideBarSearch } from './SideBarSearch'

export type Props = {
  children: ReactChildren
  navSection?: JSX.Element
  title?: JSX.Element
  params: any
}

export function NewLayout({ children, navSection = '' }: Props) {
  function Header() {
    return (
      <header className="space-around sticky top-0 z-[10]  flex h-16 w-full items-center border-b border-b-slate-200 text-slate-900 backdrop-blur-sm md:flex-row">
        <div className="ml-4  w-0 text-center md:block md:flex-[1]">
          {/* 这个内容叫什么？ yari 的 css 类名叫 top-navigation-wrap */}
          {navSection || (
            <div className="text-center text-2xl font-semibold text-slate-600">
              绮课
            </div>
          )}
        </div>
        <div className="flex w-0  flex-[4] justify-center gap-4">
          <div
            id="headerContent"
            className="text-center text-2xl font-semibold text-slate-600"
          >
            <HeaderTitle />
          </div>
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
  const items = [
    { href: '/collection', name: '收藏夹' },
    { href: '/schedule', name: '课表查询' },
  ]

  /* todo: 移动端改成 bottom Tab */
  return (
    <aside className="top-16 col-span-1 row-span-4 hidden space-y-2 border-gray-200 md:sticky md:block md:h-[calc(100vh-4rem)] md:border-r md:p-4">
      {/* todo: 这个搜索框如何 SSR 化？ ? */}
      {<SideBarSearch />}
      <ul className="space-y-1">
        {/* todo: 这里加一个搜索框 */}

        {items.map(({ href, name }) => (
          <li
            key={name}
            className={clsx(
              'rounded  px-4 py-2 transition-all hover:scale-[102%] hover:bg-slate-100',
              {
                'bg-slate-100': true,
              }
            )}
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="fixed bottom-0 p-4 text-sm">
        花野猫筑之以 ❤
        <br />
        赏他一碗米线
      </p>
    </aside>
  )
}
