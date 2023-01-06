'use client'
import React from 'react'
import qs from 'qs'
import useSWR from 'swr'
import { fetcher } from 'lib/fetcher'
import { useSearchParams } from 'next/navigation'
import { Student, Teacher } from '@prisma/client'
import { H2 } from 'components/H2'
import Image from 'next/image'

export default function Content() {
  const sp = useSearchParams()
  const q = sp.get('query')

  // 条件请求 https://swr.vercel.app/zh-CN/docs/conditional-fetching
  const { data, error } = useSWR<[Student[], Teacher[], Location[]]>(
    q ? `/api/search?${qs.stringify({ query: q })}` : null,
    fetcher
  )

  return (
    <div className="min-h-[70vh]] bg-slate-50">
      {/* todo: 这个也放到 header 吧 */}
      {/* <section className="sticky top-16 col-span-3 flex h-12 items-center bg-slate-50 md:top-2 md:bg-transparent">
        <span className="text-xl text-slate-500">←</span>{' '}
        <div className="relative z-[11] ml-auto">{query} 的搜索结果</div>
      </section> */}
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
    <H2 title={`学生（${students?.length}）`} slate>
      <ul className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-x-8 md:p-4 md:px-8">
        {(students as Student[]).map((s) => (
          <li
            className="flex items-center gap-2 bg-white p-4 text-sm shadow"
            key={s.id}
          >
            <div className="relative">
              {/* https://github.com/vercel/avatar */}
              <Image
                className="mr-2 flex-shrink-0 rounded-full shadow-inner"
                width={46}
                height={46}
                src={`https://avatar.vercel.sh/${encodeURIComponent(
                  s.professionName + s.grade + s.name
                )}.svg`}
                alt={'s.name'}
              />
            </div>
            <div className="w-0 flex-1">
              <div className="font-semibold text-gray-800">{s.name}</div>
              <div className="truncate  text-gray-900 ">{s.className}</div>
            </div>
            <div className="w-0 flex-1 font-light text-gray-900">
              <div className="truncate">{s.facultyName}</div>
              <div className="truncate">{s.professionName}</div>
            </div>
            {/* todo: 这里是一个 ICON，点击后查看学生名片 */}
            {/* 或者做成一个折叠块？参考https://developer.mozilla.org/en-US/plus/updates */}
            {/* <div className="col-span-1 items-center justify-center">○</div> */}
          </li>
        ))}
      </ul>
    </H2>
  )
}
