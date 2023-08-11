import Empty from '@/components/Empty'
import { searchOwner } from '@/lib/service/searchOwner'
import { Location, Student, Teacher } from '@prisma/client'
import Avatar from 'boring-avatars'
import { H2 } from 'components/H2'
import Link from 'next/link'
import React, { Suspense } from 'react'

// 通过课程也应当可以进入一份课表，filter subject 的 courses 就可以了，类似于选课，学生就知道课程开在什么时候了。。
// 这样从搜索结果里面其实可以设定成既可以进课表，又可以进实体。实体可以用封面、头像之类的进行美化
// 实体通过一个 modal 进入，可以增加一点动效
// 参考 notion 的 cover，有没有对应的 api?

// 如果没有这个，build 后不 work
export const revalidate = 0

export default async function Content({ searchParams }) {
  // todo: 要不还是改回使用 params 吧，否则现在子组件没法改 layout
  const { query } = searchParams
  // 如果要搜课程的话那这个函数就不应该叫做 searchOwner 了
  const data = query ? await searchOwner(query) : []

  return (
    <div className="min-h-[70vh] bg-slate-50 relative">
      <Suspense fallback={'加载中。。。'}>
        <SearchR promise={data} query={query}></SearchR>
      </Suspense>
      {/* todo: 这个也放到 header 吧，但是 layout 页无法拿到 searchParams */}
      {/* <section className="sticky top-16 col-span-3 flex h-12 items-center bg-slate-50 md:top-2 md:bg-transparent">
        <span className="text-xl text-slate-500">←</span>{' '}
        <div className="relative z-[11] ml-auto">{query} 的搜索结果</div>
      </section> */}
      {/* todo: 其实课表页 table 应该用 grid 的 row-start 之类的去计算 */}
    </div>
  )
}

// Albums Component
async function SearchR({ promise, query }) {
  // Wait for the albums promise to resolve
  const data = await promise

  return data.some((e) => !!e.length) ? (
    <article className="space-y-8">
      <section className="mx-auto p-4">
        {/* 如果不用 tab 的话确实展示密度太小了，用了的话又破坏了之前 h2 的设计，没有用武之地了 */}
        {/* 而且用 Tab 好像不利于 SEO ? 而且没办法以言看到全部内容   */}
        {/* 暂时设计成没有结果的就折叠吧 */}

        <SearchResults data={data[0]} />
        <TeacherResult data={data[1]} />
        <LocationResult data={data[2]} />
      </section>
    </article>
  ) : query ? (
    <Empty content="没有数据"></Empty>
  ) : null
}

const H2Wrapper = ({ category, data, children }) => {
  return (
    <H2 close={!data?.length} title={`${category}（${data?.length}）`} slate>
      {children}
    </H2>
  )
}

// todo: 抽一个 People
function SearchResults({ data }: { data: Student[] }) {
  return (
    <H2Wrapper data={data} category={'学生'}>
      <Students data={data} />
    </H2Wrapper>
  )
}

export function Students({ data }: { data: Student[] }) {
  return (
    <ul className=" grid grid-cols-1 gap-4 md:grid-cols-2 md:p-4 md:px-8 lg:gap-x-8">
      {(data as Student[]).map((s) => (
        <Person
          key={s.id}
          href={`/schedule/student/${s.id}`}
          name={s.name}
          avatarName={s.facultyName + s.name}
          plateau={
            s.sex === '男'
              ? ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6']
              : ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899']
          }
          infos={[s.className, s.facultyName, s.professionName]}
        />
      ))}
    </ul>
  )
}

function Person({ href, name, avatarName, plateau, infos }): JSX.Element {
  return (
    <li className=" bg-white p-4 text-sm shadow">
      <Link href={href} className={'flex items-center gap-2'}>
        <Avatar size={46} name={avatarName} variant="marble" colors={plateau} />
        <div className="w-0 flex-1">
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="truncate  text-gray-900 ">{infos[0]}</div>
        </div>
        <div className="w-0 flex-1 font-light text-gray-900">
          <div className="truncate">{infos[1]}</div>
          <div className="truncate">{infos[2]}</div>
        </div>
        {/* todo: 这里是一个 ICON，点击后查看学生名片 */}
        {/* 或者做成一个折叠块？参考https://developer.mozilla.org/en-US/plus/updates */}
        {/* <div className="col-span-1 items-center justify-center">○</div> */}
      </Link>
    </li>
  )
}

function TeacherResult({ data }: { data: Teacher[] }) {
  return (
    <H2Wrapper data={data} category={'教师'}>
      <ul className=" grid grid-cols-1 gap-4 md:grid-cols-2 md:p-4 md:px-8 lg:gap-x-8">
        {data.map((teacher) => (
          <Person
            key={teacher.id}
            href={`/schedule/teacher/${teacher.id}`}
            name={teacher.name}
            avatarName={teacher.facultyName + teacher.name}
            plateau={['#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316']}
            infos={[teacher.title, teacher.facultyName, teacher.eduBackground]}
          />
        ))}
      </ul>
    </H2Wrapper>
  )
}

function LocationResult({ data }: { data: Location[] }) {
  return (
    <H2Wrapper data={data} category={'地点'}>
      <ul className=" grid grid-cols-1 gap-4 md:grid-cols-2 md:p-4 md:px-8 lg:gap-x-8">
        {data.map((location) => (
          <li key={location.id}>
            <Link
              href={`/schedule/location/${location.id}`}
              className="flex items-center gap-2 bg-white p-4 text-sm shadow"
            >
              <div className="relative">
                {/* todo: 根据校区名的色板 */}
                <div className="h-[46px] w-[46px] items-center justify-center bg-slate-100">
                  {location.campus}
                </div>
              </div>
              <div className="w-0 flex-1">
                <div className="font-semibold text-gray-800">
                  {location.name}
                </div>
                <div className="truncate  text-gray-900 ">
                  {location.building}
                </div>
              </div>
              <div className="w-0 flex-1 font-light text-gray-900">
                <div className="truncate">{location.category}</div>
                <div className="truncate">{location.seatCount}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </H2Wrapper>
  )
}
