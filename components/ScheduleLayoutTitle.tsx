'use client'

import { CourseItem } from '@/lib/types/CourseItem'
import { useTerm } from '../lib/hooks/useTerm'

type props = {
  title: string
  courses: CourseItem[]
}

export default function ScheduleLayoutTitle({ title, courses }: props) {
  const { navToTerm, activeTerm, terms } = useTerm(courses)

  return (
    <div className="flex flex-col items-start gap-1 md:flex-row md:items-end">
      <h1 className="inline-flex text-xl  font-light text-slate-700 md:mr-4 md:text-2xl">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <select
          onChange={(v) => {
            navToTerm(v.target.value)
          }}
          value={activeTerm}
          name="term"
          id=""
          className="rounded  border border-slate-200 bg-white px-[.2em] py-[.12em] text-xs font-medium text-slate-700 focus:border-transparent focus:ring-1 focus:ring-slate-500 md:text-sm"
        >
          {terms.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={'2'}
          name="week"
          id=""
          className="rounded  border border-slate-200 bg-white px-[.2em] py-[.12em] text-xs font-medium text-slate-700 focus:border-transparent focus:ring-1 focus:ring-slate-500"
        >
          <option value="2">全部周</option>
        </select>
      </div>
    </div>
  )
}
