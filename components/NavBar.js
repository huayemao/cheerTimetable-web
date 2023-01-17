import React from 'react'
import { useRouter } from 'next/router'
import cn from 'clsx'
import Link from 'next/link'
import { useMenu, useMenuDispatch } from 'contexts/menuContext'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'

export default function NavBar({ children }) {
  const toggleCollapsed = useMenuDispatch()
  const { collapsed } = useMenu()
  const router = useRouter()
  const isTimeTablePage = router.pathname.includes('curriculum')

  return (
    <nav className="sticky top-0 z-10 flex h-14 w-full items-center justify-around border-gray-200 bg-white bg-opacity-80 drop-shadow-sm backdrop-blur-lg backdrop-filter">
      <div className="flex-1 text-center lg:hidden">
        <Link href={'/'} className={'flex-1 text-3xl text-blue-400 hover:text-blue-500'}>
          绮课
        </Link>
      </div>
      <div
        style={{ flex: 4 }}
        className="flex flex-wrap items-center justify-center space-x-8 py-1"
      >
        {children}
      </div>
      <div className="flex-1 text-center lg:hidden">
        <button
          onClick={toggleCollapsed}
          data-collapse-toggle="mobile-menu"
          type="button"
          className="rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {collapsed ? (
            <Bars3Icon className="h-6 w-6" />
          ) : (
            <XMarkIcon className="h-6 w-6"></XMarkIcon>
          )}
        </button>
      </div>
    </nav>
  )
}
