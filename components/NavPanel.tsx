import { GithubIcon } from './Links/GithubLink'
import {
  HeartIcon,
  PaperAirplaneIcon,
  PhotographIcon,
} from '@heroicons/react/outline'
import { Tooltip } from 'components/common/Tooltip'
import { YuqueIcon } from 'components/Links/YuequeLink'
import { useRouter } from 'next/router'

export function NavPanel() {
  const router = useRouter()
  return (
    <div className="flex justify-around space-x-2 rounded-3xl bg-blue-200/10 py-1.5 px-2.5 shadow-lg md:space-x-4 lg:absolute lg:left-40 lg:flex-col lg:space-x-0 lg:space-y-2 lg:py-4 lg:shadow-xl">
      <Tooltip content={<div>全部课程</div>} placement="right" style="light">
        <button
          onClick={() => router.push('/subjects')}
          className="mouse flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-0 text-blue-500 shadow transition duration-200 ease-in hover:bg-blue-200 focus:outline-none active:shadow-lg"
        >
          <PaperAirplaneIcon className="inline-block h-6 w-6"></PaperAirplaneIcon>
        </button>
      </Tooltip>
      <Tooltip content={<div>健康打卡</div>} placement="right" style="light">
        <button
          onClick={() =>
            router.push('https://wxxy.csu.edu.cn/ncov/wap/default/index')
          }
          className="mouse flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 p-0 text-blue-500 shadow transition duration-200 ease-in hover:bg-blue-200 focus:outline-none active:shadow-lg"
        >
          <HeartIcon className="inline-block h-6 w-6" />
        </button>
      </Tooltip>
      <Tooltip content={<div>语雀</div>} placement="right" style="light">
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
      <Tooltip content={<div>Github</div>} placement="right" style="light">
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
