import React from 'react'
import qs from 'qs'
import useSWR from 'swr'
import { fetcher } from 'lib/fetcher'
import { useRouter } from 'next/router'
import { Student, Teacher } from '@prisma/client'
import { H2 } from 'components/H2'

export default function Content() {
  const router = useRouter()
  const { query } = router.query

  // 条件请求 https://swr.vercel.app/zh-CN/docs/conditional-fetching
  const { data, error } = useSWR<[Student[], Teacher[], Location[]]>(
    query ? `/api/search?${qs.stringify({ query })}` : null,
    fetcher
  )
  return (
    <div className='bg-slate-50 min-h-[70vh]'>
      <section className="sticky top-16 col-span-3 flex h-12 items-center bg-slate-50 md:top-2 md:bg-transparent">
        <span className="text-xl text-slate-500">←</span>{' '}
        <div className="ml-auto">{query} 的搜索结果</div>
      </section>
      {/* todo: 或者其实搜课表也集成到这个搜索页吧 */}
      {/* todo: 其实课表页 table 应该用 grid 的 row-start 之类的去计算 */}
      {data?.length ? (
        <article className="space-y-8">
          <section className="mx-auto p-4">
            <SearchResults data={data} />
          </section>
        </article>
      ) : (
        <>加载中</>
      )}
    </div>
  )
}

function SearchResults({ data }: { data: [Student[], Teacher[], Location[]] }) {
  const [students] = data
  return (
    <H2 title={`学生（${students?.length}）`}>
      <ul className="divide-y divide-slate-300 md:p-4 md:px-8">
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
    </H2>
  )
}
