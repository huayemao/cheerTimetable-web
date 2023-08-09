import { getProfession, getProfessions } from '@/lib/service/profession'
import clsx from 'clsx'
import { APP_NAME } from 'constants/siteConfig'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: { name: string }
}): Promise<Metadata> {
  // read route params
  const { name } = params

  return {
    title: `${decodeURIComponent(name || '')} | ${APP_NAME}`,
    abstract: '中南大学' + decodeURIComponent(name || ''),
    description: '中南大学' + decodeURIComponent(name || ''),
  }
}

export default async function Department({ params }) {
  const { name } = params
  const res = await getProfession(decodeURIComponent(name as string))
  const data = groupBy(res, 'professionName')
  const professions = map(data, (v, k) => {
    return {
      ...v[0],
      professionName: v[0].professionName,
      grades: v
        .map((e) => {
          return {
            grade: e.grade,
            studentCount: e.studentCount,
          }
        })
        .sort((a, b) => Number(b.grade) - Number(a.grade)),
    }
  })

  return (
    <div className="bg-slate-50 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {professions.map((e) => {
        return <Profession key={e.professionName} data={e}></Profession>
      })}
    </div>
  )
}

export async function generateStaticParams() {
  const data = await getProfessions()
  const params = Object.values(data)
    .flat()
    .map((e) => {
      return {
        name: e.professionName,
      }
    })

  return params
}

const Profession = ({
  data,
}: {
  data: {
    professionName: string
    grades: {
      grade: string
      studentCount: number | undefined
    }[]
    facultyName: string
    grade: string
    studentCount?: number | undefined
  }
}) => {
  const { facultyName, professionName: name, studentCount, grades } = data
  const term =
    grades[0].grade + '-' + String(Number(grades[0].grade) + 1) + '-1'

  const totalStudentCount = grades.reduce((acc, item) => {
    return acc + (item.studentCount || 0)
  }, 0)

  return (
    <Link
      href={`/schedule/profession/${name}/${term}/${grades[0].grade}`}
      className="hover:shadow-muted-300/30 dark:hover:shadow-muted-800/30 group-hover:!border-primary-500 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-md hover:shadow-xl p-5"
    >
      <div className="mb-6 flex gap-2">
        <div className="relative inline-flex shrink-0 items-center justify-center outline-none h-10 w-10 rounded-full bg-muted-100 dark:bg-muted-700">
          <div
            className={clsx(
              'bg-info-500/20 text-info-500 flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full',
              {
                'text-rose-500 bg-rose-500/20': name.charCodeAt(0) % 4 == 0,
                'text-violet-500 bg-violet-500/20': name.charCodeAt(0) % 4 == 1,
                'text-cyan-500 bg-cyan-500/20': name.charCodeAt(0) % 4 == 2,
                'text-teal-500 bg-teal-500/20': name.charCodeAt(0) % 4 == 3,
              }
            )}
          >
            {name.slice(0, 1)}
          </div>
        </div>
        <div>
          <p className="font-heading text-sm font-medium leading-normal line-clamp-1">
            {name}
          </p>
          <p className="font-alt text-xs font-normal leading-normal text-muted-400">
            {facultyName}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between text-muted-400">
        <sub>
          {grades[0].grade}级 - {grades[grades.length - 1].grade}级
        </sub>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <svg
              data-v-cd102a71=""
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              className="icon h-4 w-4"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
            >
              <g fill="currentColor">
                <path
                  d="M136 108a52 52 0 1 1-52-52a52 52 0 0 1 52 52Z"
                  opacity=".2"
                />
                <path d="M117.25 157.92a60 60 0 1 0-66.5 0a95.83 95.83 0 0 0-47.22 37.71a8 8 0 1 0 13.4 8.74a80 80 0 0 1 134.14 0a8 8 0 0 0 13.4-8.74a95.83 95.83 0 0 0-47.22-37.71ZM40 108a44 44 0 1 1 44 44a44.05 44.05 0 0 1-44-44Zm210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16a44 44 0 1 0-16.34-84.87a8 8 0 1 1-5.94-14.85a60 60 0 0 1 55.53 105.64a95.83 95.83 0 0 1 47.22 37.71a8 8 0 0 1-2.33 11.07Z" />
              </g>
            </svg>
            <span className="font-sans">{totalStudentCount}</span>
          </div>
        </div>
      </div>
      {/* <div className='w-full'>
  {grades.map(e=>
      <div
      key={e.grade}
        className="relative shrink-0 items-center justify-center outline-none h-6 w-6 rounded-full bg-muted-100 dark:bg-muted-700"
      >
        {e.grade}
      </div>)}
      </div> */}
    </Link>
  )
}
