import NavBar from '../NavBar'
import cn from 'clsx'
import { SideBar } from '../SideBar'
import { noop } from 'lodash'
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
import { FC, ReactElement, ReactNode } from 'react'
import Link from 'next/link'
import { SubjectsLink } from '../Links/SubjectsLink'
import { HealthLink } from '../Links/HealthLink'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { CAN_COLLECT_ROUTES } from '../../constants'
import { CollectionLink } from 'components/Links/CollectionLink'
import dynamic from 'next/dynamic'

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
              <HealthLink />
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
  title?: ReactElement | null
  menuItems?: ReactElement | null
}

export default function Layout({
  sidebarContent,
  children,
  title: extraNavBarChildren,
  menuItems,
}: props) {
  const router = useRouter()

  const loading = useLinkTransition()

  const isDeskTop =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (process.browser && useMediaQuery('(min-width: 1024px)', true, false)) ||
    false

  return (
    <MenuProvider>
      <div className="grid min-h-screen lg:grid-cols-5">
        {process.browser && isDeskTop && <SideBar>{sidebarContent}</SideBar>}
        <div className="col-span-4 flex h-full flex-col">
          <NavBar>{extraNavBarChildren}</NavBar>
          <main className="h-full flex-1">
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
