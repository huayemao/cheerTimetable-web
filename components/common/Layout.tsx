import NavBar from '../NavBar'
import cn from 'clsx'
import { SideBar } from '../SideBar'
import 'css-doodle'
import useMediaQuery from '../../lib/hooks/useMediaQuery'
import useBodyScrollLock from 'lib/hooks/useBodyScrollLock'
import { Router, useRouter } from 'next/router'
import Loading from 'components/Loading'
import { GithubLink } from '../Links/GithubLink'
import { YuqueLink } from '../Links/YuequeLink'
import MenuProvider, {
  useMenu,
  useMenuDispatch,
} from '../../contexts/menuContext'
import { FC, isValidElement, ReactElement, ReactNode } from 'react'
import { SubjectsLink } from '../Links/SubjectsLink'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { CAN_COLLECT_ROUTES } from '../../constants'
import { CollectionLink } from 'components/Links/CollectionLink'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Search from 'components/Search'

const CollectButton = dynamic(() => import('components/CollectButton'), {
  ssr: false,
  loading: () => <p>...</p>,
})

const MenuBody = ({ children }) => {
  useBodyScrollLock()

  return (
    <div className="fixed left-0 top-12 bottom-0 flex w-full flex-col bg-black bg-opacity-40 drop-shadow  md:space-x-8 md:pt-0 md:font-medium lg:static">
      <div className="w-full bg-white px-2 py-5 md:px-10">{children}</div>
    </div>
  )
}

const Menu: FC = ({ children }) => {
  const router = useRouter()
  const { collapsed } = useMenu()
  const toggle = useMenuDispatch()

  const canCollect = (Object.values(CAN_COLLECT_ROUTES) as string[]).includes(
    router.route
  )

  return (
    (!collapsed && (
      <div className={cn('w-full lg:hidden lg:w-auto')} id="mobile-menu">
        <MenuBody>
          <div className="space-y-2  bg-white px-4">
            {canCollect && <CollectButton />}
            {children}
          </div>
          {(children || canCollect) && <hr className="mt-4" />}
          <ul className="space-y-3 bg-white bg-opacity-75 px-3 py-4 backdrop-blur-xl backdrop-filter">
            <li
              onClick={toggle}
              className="text w-full text-gray-600 hover:text-blue-500"
            >
              <SubjectsLink />
            </li>
            <li
              onClick={toggle}
              className="text w-full text-gray-600 hover:text-blue-500"
            >
              <CollectionLink />
            </li>
            <li className="w-full text-sm text-gray-600 hover:text-blue-500">
              <GithubLink />
            </li>
            <li className="w-full text-sm text-gray-600 hover:text-blue-500">
              <YuqueLink />
            </li>
          </ul>
        </MenuBody>
      </div>
    )) ||
    null
  )
}

type props = {
  children: ReactNode | null
  sidebarContent?: ReactElement | null
  title?: ReactElement | string | null
  menuItems?: ReactElement | null
  className?: string
}

export default function Layout({
  sidebarContent,
  children,
  title,
  menuItems,
  className,
}: props) {
  const router = useRouter()

  const loading = useLinkTransition()

  const isDeskTop =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (process.browser && useMediaQuery('(min-width: 1024px)', true, false)) ||
    false

  return (
    <MenuProvider>
      <Head>
        <title>{title}-绮课</title>
      </Head>
      <div className="min-h-screen lg:grid lg:grid-cols-5">
        {process.browser && isDeskTop && <SideBar>{sidebarContent}</SideBar>}
        <div className="col-span-4 flex h-full flex-col">
          <NavBar>
            {isValidElement(title) ? (
              title
            ) : (
              <h2 className="break-all text-center text-xl font-thin text-blue-500">
                {title}
              </h2>
            )}
          </NavBar>
          <main className={'h-full flex-1 ' + className}>
            {router.isFallback || loading ? (
              <div className="flex h-full items-center justify-center">
                <Loading size={50} />
              </div>
            ) : (
              children
            )}
          </main>
          {process.browser && !isDeskTop && <Menu>{menuItems}</Menu>}
        </div>
      </div>
    </MenuProvider>
  )
}

type Props = {
  children: JSX.Element
  ignore: boolean
  router: Router
}

export function NewLayout({ children, ignore, router }: Props) {
  const shouldIgnoreNewLayout = !['/search', '/schedule'].some((e) =>
    router.pathname.includes(e)
  )

  function Header() {
    const router = useRouter()
    return (
      <header className="space-around sticky top-0 z-[10]  flex h-16 w-full  flex-row-reverse items-center border-b border-b-slate-200 text-slate-900 backdrop-blur-sm md:flex-row">
        <div className="hidden w-0 text-center md:block md:flex-1">
          {/* todo: 这个搜索框 */}
          <Search
            iconClassName={'text-slate-400'}
            className="w-44 rounded text-sm ring-1 ring-slate-300 focus:ring-blue-400"
            onSubmit={(v) =>
              router.push({ pathname: '/search', query: { query: v } })
            }
            placeholder={'搜索'}
          />
        </div>
        <div className="flex w-0 flex-1  justify-center gap-4 md:flex-[4]">
          <div
            id="headerContent"
            className="text-center text-2xl font-semibold text-slate-600"
          >
            {/* 绮课 */}
          </div>
        </div>
      </header>
    )
  }

  if (shouldIgnoreNewLayout) {
    return children
  }
  return (
    <div className="min-h-screen w-full   text-slate-800">
      <Header />
      <div className="grid w-full grid-cols-1 md:grid-cols-5">
        <Sidebar />
        <main className="col-span-4 h-full bg-slate-50 md:py-2 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  /* todo: 移动端改成菜单吧 */
  return (
    /* todo: 安卓 chrome 老是会有滚动条，不清楚跟这里是否有关系 */
    <aside className="top-16 col-span-1 row-span-4 hidden border-gray-200 md:sticky md:block md:h-[calc(100vh-4rem)] md:border-r md:p-4">
      <ul className="">
        {/* todo: 这里加一个搜索框 */}
        <li className="rounded  px-4 py-2 transition-all hover:scale-[102%] hover:bg-slate-100">
          收藏夹
        </li>
        <li className="rounded bg-slate-100 px-4 py-2 transition-all hover:scale-[102%] hover:bg-slate-100">
          课表查询
        </li>
        <li className="rounded px-4 py-2">【WIP】课程卡片制作</li>
      </ul>
      <p className="fixed bottom-0 p-4 text-sm">
        花野猫筑之以 ❤
        <br />
        赏他一碗米线
      </p>
    </aside>
  )
}
