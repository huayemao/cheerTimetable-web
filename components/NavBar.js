import React from 'react'
import { useRouter } from 'next/router'
import cn from 'clsx'
import Link from 'next/link'

export default function NavBar({ children, renderMenuItems, toggleCollapsed }) {
  const router = useRouter()
  const isTimeTablePage = router.pathname.includes('curriculum')

  return (
    <nav className="py-auto fixed top-0 z-10 h-16 w-full rounded border-gray-200 bg-white py-2.5 drop-shadow-sm dark:bg-gray-800">
      <div className="container flex flex-wrap items-center justify-between px-4">
        <Link href={'/'}>
          <a
            className={cn(
              'ml-4 text-2xl text-blue-400 hover:text-blue-500 lg:flex-1',
              {}
            )}
          >
            绮课
          </a>
        </Link>
        <div
          style={{ flex: isTimeTablePage ? 4 : 16 }}
          className="flex justify-center"
        >
          {children}
        </div>
        <button
          onClick={toggleCollapsed}
          data-collapse-toggle="mobile-menu"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className="hidden h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  )
}
