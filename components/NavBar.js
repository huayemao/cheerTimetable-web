import React from 'react'
import { useRouter } from 'next/router'
import cn from 'clsx'
import Link from 'next/link'
import { useMenuDispatch } from 'contexts/menuContext'

export default function NavBar({ children }) {
  const toggleCollapsed = useMenuDispatch()
  const router = useRouter()
  const isTimeTablePage = router.pathname.includes('curriculum')

  return (
    <nav className="sticky top-0 z-10 flex h-14 w-full items-center justify-around border-gray-200 bg-white bg-opacity-80 drop-shadow-sm backdrop-blur-lg backdrop-filter">
      <div className="lg:hidden">
        <Link href={'/'}>
          <a className={'flex-1 text-3xl text-blue-400 hover:text-blue-500'}>
            绮课
          </a>
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center py-1 space-x-8">
        {children}
      </div>
      <button
        onClick={toggleCollapsed}
        data-collapse-toggle="mobile-menu"
        type="button"
        className="rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
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
    </nav>
  )
}
