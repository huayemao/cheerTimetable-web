import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useCollapsible from 'lib/hooks/useCollapsible'
import { GithubLink } from './Links/GithubLink'
import { YuqueLink } from './Links/YuequeLink'

const MenuItem = ({ children }) => (
  <li>
    <a
      href="#"
      className="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100"
    >
      <svg
        className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
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
        className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100"
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

export const SideBar = ({ children }) => {
  const router = useRouter()

  return (
    <aside
      className="sticky top-0 hidden  h-screen w-full flex-col drop-shadow-sm  lg:flex"
      aria-label="Sidebar"
    >
      <div
        className="absolute top-0 bottom-0 right-0 left-0 overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: `<css-doodle class="doodle">
            :doodle {
           @grid: 10 / 100vh;
           grid-gap: .5em;
            }
           
           --hue: calc(217 + .5 * @row() * @col());
               background: hsla(var(--hue), 91%, 50%, @r(.1, .9));
           clip-path: ellipse(100% 100% at @pick('0 0', '0 100%', '100% 0', '100% 100%'));
           </css-doodle>`,
        }}
      />
      <div
        className="z-10 w-full bg-white bg-opacity-40 px-3 py-4 backdrop-blur-xl backdrop-filter"
        style={{ height: 'inherit', flex: 0 }}
      >
        <ul className="space-y-3 bg-white bg-opacity-75 px-3 py-4 backdrop-blur-xl backdrop-filter">
          <div className="w-full text-center">
            <Link href={'/'}>
              <a
                className={
                  'text-3xl text-blue-400 hover:text-blue-500 lg:flex-1'
                }
              >
                绮课
              </a>
            </Link>
          </div>
          <li className="w-full text text-gray-600 hover:text-blue-500">
            <Link href={'/subjects'}>
              <a>全部课程</a>
            </Link>
          </li>
          <li className="w-full text-sm text-gray-600 hover:text-blue-500">
            <GithubLink></GithubLink>
          </li>
          <li className="w-full text-sm text-gray-600 hover:text-blue-500">
            <YuqueLink />
          </li>
        </ul>
      </div>
      <div
        className="w-full flex-grow-0 bg-white bg-opacity-40 px-3 py-4 backdrop-blur-xl backdrop-filter"
        style={{ height: 'inherit' }}
      >
        {children && (
          <ul className="space-y-3 bg-white bg-opacity-75 px-3 py-4 backdrop-blur-xl backdrop-filter">
            {children}
          </ul>
        )}
      </div>
    </aside>
  )
}
