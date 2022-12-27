import React from 'react'
import qs from 'qs'
import useSWR from 'swr'
import { fetcher } from 'lib/fetcher'
import { useRouter } from 'next/router'
import { Student, Teacher } from '@prisma/client'

export default function Content() {
  const router = useRouter()
  const { query } = router.query

  // 条件请求 https://swr.vercel.app/zh-CN/docs/conditional-fetching
  const { data, error } = useSWR<[Student[], Teacher[], Location[]]>(
    query ? `/api/search?${qs.stringify({ query })}` : null,
    fetcher
  )
  return (
    <>
      <section className="sticky top-16 col-span-3 flex h-12 items-center bg-neutral-50 md:top-2 md:bg-transparent">
        <span className="text-xl text-neutral-500">←</span>{' '}
        <div className="ml-auto">{query} 的搜索结果</div>
      </section>
      {/* todo: 或者其实搜课表也集成到这个搜索页吧 */}
      {/* todo: 其实课表页 table 应该用 grid 的 row-start 之类的去计算 */}
      {data?.length ? (
        <article className="space-y-8">
          <section className="mx-auto">
            <SearchResults data={data} />
          </section>
        </article>
      ) : (
        <>加载中</>
      )}
    </>
  )
}

function SearchResults({ data }: { data: [Student[], Teacher[], Location[]] }) {
  const [students] = data
  return (
    <details
      className="rounded-lg p-6 marker:mr-6 marker:text-neutral-600 open:bg-white   dark:open:bg-neutral-900 "
      open
    >
      <summary className="select-none text-sm font-semibold leading-6 text-neutral-800 dark:text-white">
        学生（{students?.length}）
      </summary>
      <div className="mt-3 text-sm leading-6 dark:text-neutral-400">
        <ul className="divide-y divide-neutral-300 md:p-4 md:px-8">
          {(students as Student[]).map((s) => (
            <li
              className="grid grid-cols-11 items-center gap-2 p-2 text-sm"
              key={s.id}
            >
              <div className="col-span-2 font-semibold ">{s.name}</div>
              <div className="col-span-4 truncate">{s.className}</div>
              <div className="col-span-4">
                <div className="truncate">{s.facultyName}</div>
                <div className="truncate">{s.professionName}</div>
              </div>
              {/* todo: 这里是一个 ICON，点击后查看学生名片 */}
              {/* 或者做成一个折叠块？参考https://developer.mozilla.org/en-US/plus/updates */}
              <div className="col-span-1 items-center justify-center">○</div>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
