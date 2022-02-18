import { useRouter } from 'next/router'
import Link from 'next/link'
import { TERMS } from '../constants'
import useCollapsible from 'lib/hooks/useCollapsible'
import { getTermsByStudent } from 'lib/term'
import Select from 'components/Select'

import React from 'react'

const MenuItem = ({ children }) => (
  <li>
    <a
      href="#"
      className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    >
      <svg
        className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
      </svg>
      {children}
    </a>
  </li>
)

function MenuList() {
  return <div>SideBar</div>
}

function SubList({ label, items, renderItem }) {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })
  return (
    <>
      <button
        onClick={toggleCollapsed}
        type="button"
        className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        <span className="ml-3 flex-1 whitespace-nowrap text-left">{label}</span>
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <ul
        id="dropdown-example"
        className={'space-y-2 py-2' + (collapsed ? ' hidden' : '')}
      >
        {items.map((e) => (
          <li
            key={e}
            className="focus:bg-accent-1 focus:text-accent-8 block whitespace-nowrap text-sm leading-5 text-gray-400 hover:text-gray-600 focus:outline-none lg:hover:bg-transparent"
          >
            {renderItem(e)}
          </li>
        ))}
      </ul>
    </>
  )
}

export const SideBar = () => {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })

  const router = useRouter()

  const [type, id, term] = router.query.all

  const rawTermList = type === 'student' ? getTermsByStudent(id) : TERMS

  const termItems = rawTermList.map((e) => ({ key: e, label: e + ' 学期' }))

  return (
    <div className="hidden h-screen flex-col bg-slate-50 p-2 lg:flex">
      <Link href={'/'}>
        <a className="ml-4 text-2xl text-blue-400 hover:text-blue-500">绮课</a>
      </Link>
      <aside className="w-full flex-1 overflow-y-auto" aria-label="Sidebar">
        <div className="h-full overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:bg-gray-800">
          <ul className="space-y-2">
            {/* <li>
              <SubList
                label={'学期'}
                items={TERMS}
                renderItem={(e) => (
                  <Link
                    // shallow
                    href={`/curriculum/${type}/${id}/${e}`}
                  >
                    <a
                      href="#"
                      className="group flex w-full items-center rounded-lg p-1 pl-11 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
                      {e}
                    </a>
                  </Link>
                )}
              ></SubList>
            </li> */}
            {/* <MenuItem>
              <span className="ml-3 flex-1 whitespace-nowrap">导出</span>
              <span className="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Pro
              </span>
            </MenuItem>
            <MenuItem>
              <span className="ml-3 flex-1 whitespace-nowrap">Inbox</span>
              <span className="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-200 p-3 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                3
              </span>
            </MenuItem> */}
            <Select
              options={termItems}
              renderOption={({ label, key, isActive }) => (
                <Link href={`/curriculum/${type}/${id}/${key}`}>
                  <a
                    href="#"
                    className="group flex w-full items-center rounded-lg p-1 pl-4 font-normal transition duration-75"
                  >
                    {label}
                  </a>
                </Link>
              )}
            ></Select>
          </ul>
        </div>
      </aside>
    </div>
  )
}
