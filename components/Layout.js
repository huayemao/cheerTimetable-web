import NavBar from './NavBar'
import cn from 'clsx'
import useCollapsible from 'lib/hooks/useCollapsible'
import { SideBar } from './SideBar'
import { noop } from 'lodash'

const Menu = ({ collapsed, children, toggleCollapsed }) => (
  <div
    className={cn('w-full lg:hidden lg:w-auto', {
      hidden: collapsed,
    })}
    id="mobile-menu"
  >
    <ul className="absolute left-0 top-16 bottom-0 flex w-full flex-col bg-black bg-opacity-40 drop-shadow md:flex-row md:space-x-8 md:pt-0 md:text-sm md:font-medium lg:static">
      {/* <li>
        <a
          href="#"
          className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
        >
          Services
        </a>
      </li> */}
      <div className="w-full bg-white px-2 py-5">{children}</div>
    </ul>
  </div>
)

export default function Layout({
  preview,
  children,
  extraNavBarChildren,
  renderMenuItems = noop,
}) {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })

  return (
    <>
      <div className="min-h-screen sm:h-screen">
        <NavBar
          toggleCollapsed={toggleCollapsed}
          renderMenuItems={renderMenuItems}
        >
          {extraNavBarChildren}
        </NavBar>
        <main className="h-screen pt-16 ">{children}</main>
        <div className="large:hidden">
          <Menu collapsed={collapsed} toggleCollapsed={toggleCollapsed}>
            {renderMenuItems(toggleCollapsed)}
          </Menu>
        </div>
      </div>
    </>
  )
}
