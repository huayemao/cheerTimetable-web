import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useCollapsible from 'lib/hooks/useCollapsible'
import { GithubLink } from './Links/GithubLink'
import { YuqueLink } from './Links/YuequeLink'
import { SubjectsLink } from './Links/SubjectsLink'
import { CAN_COLLECT_ROUTES } from '../constants'
import { CollectionLink } from './Links/CollectionLink'
import dynamic from 'next/dynamic'

const CollectButton = dynamic(() => import('./CollectButton'), {
  ssr: false,
  loading: () => <p>...</p>,
})

export const SideBar = ({ children }) => {
  const router = useRouter()

  const canCollect = (Object.values(CAN_COLLECT_ROUTES) as string[]).includes(
    router.route
  )

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
            <h1>
              <Link href={'/'}>
                <a
                  className={
                    'text-3xl text-blue-400 hover:text-blue-500 lg:flex-1'
                  }
                >
                  绮课
                </a>
              </Link>
            </h1>
          </div>
          <li>
            <SubjectsLink />
          </li>
          <li className="w-full text-sm text-gray-600 hover:text-blue-500">
            <CollectionLink />
          </li>
          <li className="w-full text-sm text-gray-600 hover:text-blue-500">
            <GithubLink />
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
        {(children || canCollect) && (
          <ul className="space-y-3 bg-white bg-opacity-75 px-3 py-4 backdrop-blur-xl backdrop-filter">
            {children}
            {canCollect && <CollectButton />}
          </ul>
        )}
      </div>
    </aside>
  )
}
