import NavBar from './NavBar'
import cn from 'clsx'
import useCollapsible from 'lib/hooks/useCollapsible'
import { SideBar } from './SideBar'
import { noop } from 'lodash'
import 'css-doodle'

const Menu = ({ collapsed, children, toggleCollapsed }) => (
  <div
    className={cn('w-full lg:hidden lg:w-auto', {
      hidden: collapsed,
    })}
    id="mobile-menu"
  >
    <div className="absolute left-0 top-16 bottom-0 flex w-full flex-col bg-black bg-opacity-40 drop-shadow md:flex-row md:space-x-8 md:pt-0 md:text-sm md:font-medium lg:static">
      <div className="w-full bg-white px-2 py-5">{children}</div>
    </div>
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
