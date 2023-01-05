import { memo, useCallback, useMemo, useState } from 'react'
import cn from 'clsx'
import { Cell } from './Cell'
import s from './Main.module.css'
import { parseTime } from '../../lib/parseCourseFields'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import getGridCells from 'lib/getGridCells'
import { useSearchParams } from 'next/navigation'

type TimetableProps = {
  courses: CourseItem[]
  show7days: boolean
}

type Cell = {
  courses: CourseItem[]
  rowSpan: number
}

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// todo: Mini Card
// todo: 如果没有课，默认折叠最后一行
// todo: 无课表课程
export default memo(function Timetable({ courses, show7days }: TimetableProps) {
  const sp = useSearchParams()
  const modal: string = sp.get('modal') as string
  const colCount = show7days ? 7 : 5

  const cells = useMemo(
    () => getGridCells(show7days, courses, colCount),
    [colCount, courses, show7days]
  )

  const headerArr = show7days ? DAYS : DAYS.slice(0, -2)

  return (
    <>
      <div
        className={cn(
          s.timetable,
          {
            [s['show-7-days']]: show7days,
          },
          'rounded-t border-[.1em] border-b-0 border-slate-200 !bg-slate-100'
        )}
      >
        {headerArr.map((e) => (
          <div
            key={e}
            className={
              'grid-grow-0 h-8 w-full place-self-center bg-slate-100 text-center text-sm font-semibold leading-[2.5em]'
            }
          >
            {e}
          </div>
        ))}
      </div>
      <div
        className={cn(
          s.timetable,
          {
            [s['show-7-days']]: show7days,
          },
          'p-[.1em]'
        )}
      >
        {cells.map(({ courses, rowSpan }, i, arr) => (
          <>
            <Cell
              showModal={parseInt(modal, 10) === i}
              key={`${i}${rowSpan}${courses?.[0]?.id || 0}`}
              num={i}
              courses={courses}
              rowSpan={rowSpan}
            />
          </>
        ))}
      </div>
    </>
  )
})
