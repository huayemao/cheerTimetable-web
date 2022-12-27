import { fetcher } from 'lib/fetcher'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import qs from 'qs'
import useSWR from 'swr'
import { Student, Teacher } from '@prisma/client'

type Props = {}

export default function Search({}: Props) {
  const router = useRouter()
  const { query } = router.query

  const { data, error } = useSWR<[Student[], Teacher[], Location[]]>(
    `/api/search?${qs.stringify({ query })}`,
    fetcher
  )

  const [students, teachers, locations] = data || []

  return (
    <div className="min-h-screen w-full bg-zinc-100  px-6 text-zinc-600">
      <header className="sticky top-0  flex h-16 w-full  items-center justify-center bg-zinc-100 text-zinc-900">
        <div className="flex justify-center">
          <div className="w-full text-center font-bold">𝙘𝙝𝙚𝙚𝙧 · 绮课</div>
          {/* <div>todo: logo</div> */}
        </div>
      </header>

      {/* todo: 还是用 grid 布局吧 */}
      {/* todo: 或者其实搜课表也集成到里面吧 */}
      {/* todo: 其实课表页 table 应该用 grid 的 row-start 之类的去计算 */}

      <div className="grid w-full grid-cols-1 md:grid-cols-4">
        {/*  这个 row-span-4 不能去掉或者改小，否则内容区域元素会跟侧边栏水平居中对齐，不知道怎么解，所以这样 hack*/}
        {/* todo: 这个 aside 移动端改成菜单吧 */}
        <aside className="md:sticky top-16 col-span-1 row-span-4 md:mr-8 md:h-[80vh] md:border-r-2 md:p-4">
          <ul className="">
            {/* todo: 这里加一个搜索框 */}
            <li className="px-4 py-2">搜课程</li>
            <li className="rounded bg-zinc-200 px-4 py-2">搜课表</li>
          </ul>

          <p className="fixed bottom-0 p-4 text-sm">
            花野猫用 ❤ 做的
            <br />
            赏他一碗米线
          </p>
        </aside>

        <section className="sticky top-16 col-span-3 flex h-12 items-center bg-zinc-100 md:top-2 md:bg-transparent">
          <span className="text-xl text-zinc-500">←</span>{' '}
          <div className="ml-auto">{query} 的搜索结果</div>
        </section>

        <main className="col-span-3  ">
          {data?.length ? (
            <div className="space-y-8">
              <section className="mx-auto">
                <details
                  className="rounded-lg p-6 marker:mr-6 marker:text-zinc-400 open:bg-white   dark:open:bg-zinc-900 "
                  open
                >
                  <summary className="select-none text-sm font-semibold leading-6 text-zinc-800 dark:text-white">
                    学生
                  </summary>
                  <div className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    <ul className="divide-y divide-zinc-300 text-zinc-700 md:p-4 md:px-8">
                      {(students as Student[]).map((s) => (
                        <li
                          className="grid grid-cols-11 items-center gap-2 p-2 text-sm"
                          key={s.id}
                        >
                          <div className="col-span-2 font-semibold text-zinc-600 ">
                            {s.name}
                          </div>
                          <div className="col-span-4 truncate">
                            {s.className}
                          </div>
                          <div className="col-span-4">
                            <div className="truncate">{s.facultyName}</div>
                            <div className="truncate">{s.professionName}</div>
                          </div>
                          {/* todo: 这里是一个 ICON，点击后查看学生名片 */}
                          {/* 或者做成一个折叠块？参考https://developer.mozilla.org/en-US/plus/updates */}
                          <div className="col-span-1 items-center justify-center">
                            ○
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </section>
            </div>
          ) : (
            <>加载中</>
          )}
        </main>
      </div>
    </div>
  )
}
