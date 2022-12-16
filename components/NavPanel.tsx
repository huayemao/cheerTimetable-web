import { GithubIcon } from './Links/GithubLink'
import {
  CollectionIcon,
  HeartIcon,
  PaperAirplaneIcon,
  PhotographIcon,
} from '@heroicons/react/outline'
import { Tooltip } from 'components/common/Tooltip'
import { YuqueIcon } from 'components/Links/YuequeLink'
import { useRouter } from 'next/router'
import { Collection } from './Collection'
import { memo } from 'react'
import Link from 'next/link'

function Component() {
  const router = useRouter()
  return (
    <div className="flex justify-around space-x-2 rounded-3xl bg-blue-200/10 py-1.5 px-2.5 shadow-lg md:space-x-4 lg:absolute lg:left-40 lg:flex-col lg:space-x-0 lg:space-y-2 lg:py-4 lg:shadow-xl">
      <Tooltip
        className="hover:shadow-lg"
        content={'全部课程'}
        placement="right"
        style="light"
      >
        <button
          onClick={() => router.push('/subjects')}
          className="mouse flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 p-0 text-blue-500 shadow transition duration-200 ease-in hover:bg-blue-200 focus:outline-none active:shadow-lg"
        >
          <PaperAirplaneIcon className="inline-block h-6 w-6"></PaperAirplaneIcon>
        </button>
      </Tooltip>
      <div className="hidden lg:block">
        <Tooltip
          className="hidden hover:shadow-lg lg:block"
          trigger="click"
          stilOnClick
          content={
            <Collection
              className={'h-96 w-80 text-center'}
              title={
                <div>
                  我的收藏 &nbsp;
                  <Link href={'/collection'}>
                    <a className="text-sm text-gray-700">详情</a>
                  </Link>
                </div>
              }
            />
          }
          placement="right"
          style="light"
        >
          <button className="mouse hidden h-10 w-10 items-center justify-center rounded-full bg-blue-50 p-0  text-blue-500 shadow-lg transition duration-200 ease-in focus:outline-none active:shadow-lg lg:flex">
            <CollectionIcon className="inline-block h-6 w-6" />
          </button>
        </Tooltip>
      </div>

      <div className="lg:hidden">
        <Tooltip
          className="hover:shadow-lg"
          content={'我的收藏'}
          placement="top"
          style="light"
        >
          <button
            onClick={() => router.push('/collection')}
            className="mouse flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 p-0 text-blue-500 shadow transition duration-200 ease-in focus:outline-none active:shadow-lg"
          >
            <CollectionIcon className="inline-block h-6 w-6" />
          </button>
        </Tooltip>
      </div>

      <Tooltip
        className="hover:shadow-lg"
        content={'语雀'}
        placement="right"
        style="light"
      >
        <button
          onClick={() =>
            router.push(
              'https://www.yuque.com/huayemao/cheer-timetable/overview'
            )
          }
          className="mouse flex h-10 w-10 items-center justify-center rounded-full p-0 shadow transition duration-200 ease-in hover:bg-green-500/10 focus:outline-none active:shadow-lg"
        >
          <YuqueIcon />
        </button>
      </Tooltip>
      <Tooltip
        className="hover:shadow-lg"
        content={<div>Github</div>}
        placement="right"
        style="light"
      >
        <button
          onClick={() =>
            router.push('https://github.com/huayemao/cheerTimetable-web')
          }
          className="mouse flex h-10 w-10 items-center justify-center rounded-full p-0 shadow transition duration-200 ease-in hover:bg-gray-100 focus:outline-none active:shadow-lg"
        >
          <GithubIcon />
        </button>
      </Tooltip>
    </div>
  )
}

export const NavPanel = memo(Component)
