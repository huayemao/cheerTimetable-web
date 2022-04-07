import NavBar from './NavBar'
import cn from 'clsx'
import { SideBar } from './SideBar'
import { noop } from 'lodash'
import 'css-doodle'
import useMediaQuery from '../lib/hooks/useMediaQuery'
import useBodyScrollLock from 'lib/hooks/useBodyScrollLock'
import { useRouter } from 'next/router'
import Loading from 'components/Loading'
import { GithubLink } from './Links/GithubLink'
import { YuqueLink } from './Links/YuequeLink'
import MenuProvider, { useMenu } from '../contexts/menuContext'

const MenuBody = ({ children }) => {
  useBodyScrollLock()

  return (
    <div className="fixed left-0 top-12 bottom-0 flex w-full flex-col bg-black bg-opacity-40 drop-shadow md:flex-row md:space-x-8 md:pt-0 md:text-sm md:font-medium lg:static">
      <div className="w-full bg-white px-2 py-5">{children}</div>
    </div>
  )
}

const Menu = ({ children, toggleCollapsed }) => {
  const { collapsed } = useMenu()
  return (
    !collapsed && (
      <div className={cn('w-full lg:hidden lg:w-auto')} id="mobile-menu">
        <MenuBody>
          {children}
          <ul className="space-y-3 bg-white bg-opacity-75 px-3 py-4 backdrop-blur-xl backdrop-filter">
            <li className="w-full text-sm text-slate-500 hover:text-blue-500">
              <GithubLink />
            </li>
            <li className="w-full text-sm text-slate-500 hover:text-blue-500">
              <YuqueLink />
            </li>
          </ul>
        </MenuBody>
      </div>
    )
  )
}

export default function Layout({
  sidebarContent = <></>,
  children,
  extraNavBarChildren = <></>,
  menuItems = noop,
}) {
  const router = useRouter()

  const isDeskTop =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (process.browser && useMediaQuery('(min-width: 1024px)', true, false)) ||
    false

  return (
    <MenuProvider>
      <div className="grid min-h-screen lg:grid-cols-5">
        {process.browser && isDeskTop && <SideBar>{sidebarContent}</SideBar>}
        <div className="col-span-4 flex flex-col">
          <NavBar menuItems={menuItems}>{extraNavBarChildren}</NavBar>
          <main className="h-full flex-1">
            {router.isFallback ? (
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
