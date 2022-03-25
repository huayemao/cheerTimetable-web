import NavBar from './NavBar'
import cn from 'clsx'
import useCollapsible from 'lib/hooks/useCollapsible'
import { SideBar } from './SideBar'
import { noop } from 'lodash'
import 'css-doodle'
import useMediaQuery from '../lib/hooks/useMediaQuery'
import useBodyScrollLock from 'lib/hooks/useBodyScrollLock'

const MenuBody = ({ children }) => {
  useBodyScrollLock()

  return (
    <div className="fixed left-0 top-12 bottom-0 flex w-full flex-col bg-black bg-opacity-40 drop-shadow md:flex-row md:space-x-8 md:pt-0 md:text-sm md:font-medium lg:static">
      <div className="w-full bg-white px-2 py-5">{children}</div>
    </div>
  )
}

const Menu = ({ collapsed, children, toggleCollapsed }) => {
  return (
    !collapsed && (
      <div className={cn('w-full lg:hidden lg:w-auto')} id="mobile-menu">
        <MenuBody>{children}</MenuBody>
      </div>
    )
  )
}

export default function Layout({
  sidebarContent = <></>,
  children,
  extraNavBarChildren = <></>,
  renderMenuItems = noop,
}) {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })

  const isDeskTop =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (process.browser && useMediaQuery('(min-width: 1024px)', true, false)) ||
    false

  return (
    <>
      <div className="min-h-screen">
        <div className="grid lg:grid-cols-5">
          {process.browser && isDeskTop && <SideBar>{sidebarContent}</SideBar>}
          <div className="col-span-4 flex flex-col">
            <NavBar
              toggleCollapsed={toggleCollapsed}
              renderMenuItems={renderMenuItems}
            >
              {extraNavBarChildren}
            </NavBar>
            <main>{children}</main>
            {process.browser && !isDeskTop && (
              <Menu collapsed={collapsed} toggleCollapsed={toggleCollapsed}>
                {renderMenuItems(toggleCollapsed)}
              </Menu>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
