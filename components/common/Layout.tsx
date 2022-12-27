import NavBar from '../NavBar'
import cn from 'clsx'
import { SideBar } from '../SideBar'
import 'css-doodle'
import useMediaQuery from '../../lib/hooks/useMediaQuery'
import useBodyScrollLock from 'lib/hooks/useBodyScrollLock'
import { useRouter } from 'next/router'
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
}

export function NewLayout({ children, ignore }: Props) {
  if (ignore) {
    return children
  }
  return (
    <div className="min-h-screen w-full bg-neutral-50  text-neutral-800">
      <Header />
      <div className="grid w-full grid-cols-1 md:grid-cols-4">
        <Sidebar />
        <main className="col-span-3 px-4">{children}</main>
      </div>
    </div>
  )
}

function Sidebar() {
  /* todo: 移动端改成菜单吧 */
  return (
    /* todo: 安卓 chrome 老是会有滚动条，不清楚跟这里是否有关系 */
    <aside className="top-16 col-span-1 hidden border-neutral-200 bg-neutral-100 md:sticky md:block md:h-[calc(100%-4rem)] md:border-r-2 md:p-4">
      <ul className="">
        {/* todo: 这里加一个搜索框 */}
        <li className="px-4 py-2">搜课程</li>
        <li className="rounded bg-neutral-200 px-4 py-2">搜课表</li>
      </ul>

      <p className="fixed bottom-0 p-4 text-sm">
        花野猫筑之以 ❤
        <br />
        赏他一碗米线
      </p>
    </aside>
  )
}

function Header() {
  const router = useRouter()
  return (
    <header className="space-around sticky  top-0 flex h-16  w-full flex-row-reverse items-center border-b-2 border-b-neutral-200 bg-neutral-100 text-neutral-900 md:flex-row">
      <div className="w-0 flex-[1.5] text-center md:flex-1">
        <Search
          iconClassName={'text-neutral-400'}
          className="w-48 md:w-64 focus:ring-current"
          onSubmit={(v) =>
            router.push({ pathname: '/search', query: { query: v } })
          }
          placeholder={'搜索'}
        />
      </div>
      <div className="flex w-0 flex-1 justify-center md:flex-[3]">
        <div className="w-full text-center font-bold">𝙘𝙝𝙚𝙚𝙧 · 绮课</div>
        {/* <div>todo: logo</div> */}
      </div>
    </header>
  )
}
