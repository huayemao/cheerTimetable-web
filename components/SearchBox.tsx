'use client'
import { useRouter } from 'next/navigation'
import { Logo } from './Logo'

export const SearchBox = () => {
  const router = useRouter()

  return (
    <div className="ltablet:max-w-sm bg-muted-200 dark:bg-muted-800/60 rounded-xl p-8 lg:max-w-md">
      <div className="mb-8 max-w-sm">
        <Logo />
        <p className="font-heading text-xl font-medium leading-normal leading-normal mb-2">
          搜索课表
        </p>
        <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-400">
          你可以在这里搜索学生、任课教师、上课地点、专业名称。其中上课地点和专业名称支持模糊搜索
        </p>
      </div>
      <div className="relative w-full">
        <form
          className="group/autocomplete relative"
          method="GET"
          action="/search"
        >
          <input
            id="headlessui-combobox-input-480"
            name="query"
            type="search"
            tabIndex={0}
            className="peer nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 w-full border bg-white font-sans leading-5 outline-transparent transition-all duration-300 focus:shadow-lg focus:ring-0 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 placeholder:text-transparent dark:placeholder:!text-transparent rounded-xl"
            placeholder="请输入..."
          />
          <label
            id="headlessui-combobox-label-481"
            className="text-primary-500 peer-focus-visible:text-primary-500 dark:peer-focus-visible:text-primary-500 pointer-events-none absolute inline-flex h-5 select-none items-center leading-none transition-all duration-300 peer-placeholder-shown:text-muted-300 dark:peer-placeholder-shown:text-muted-600 start-10 -ms-10 -mt-8 text-xs peer-placeholder-shown:ms-0 peer-placeholder-shown:mt-0 peer-placeholder-shown:text-[0.825rem] peer-focus-visible:-ms-10 peer-focus-visible:-mt-8 peer-focus-visible:text-xs top-2.5"
          >
            搜索课表
          </label>
          <div className="text-muted-400 group-focus-within/autocomplete:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 h-10 w-10">
            <svg
              data-v-cd102a71=""
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              className="icon h-4 w-4"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21l-4.35-4.35" />
              </g>
            </svg>
          </div>
        </form>
      </div>
    </div>
  )
}


