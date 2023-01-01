import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import cn from 'clsx'
import { Cell } from './Cell'
import s from './Timetable.module.css'
import { parseTime } from '../../lib/parseCourseFields'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import getGridCells from 'lib/getGridCells'

type TimetableProps = {
  courses: CourseItem[]
  show7days: boolean
}

type Cell = {
  courses: CourseItem[]
  rowSpan: number
}

// todo: Mini Card
export default function Timetable({ courses, show7days }: TimetableProps) {
  const router = useRouter()
  const modal: string = router.query.modal as string
  const colCount = show7days ? 7 : 5

  const cells = useMemo(
    () => getGridCells(show7days, courses, colCount),
    [colCount, courses, show7days]
  )

  return (
    <div className="">
      <div
        className={cn(
          s.timetable,
          {
            [s['show-7-days']]: show7days,
          },
          'rounded-t !bg-slate-100 border-slate-200 border-[.1em] border-b-0'
        )}
      >
        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((e) => (
          <div
            key={'e'}
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
              key={i}
              num={i}
              courses={courses}
              rowSpan={rowSpan}
            />
          </>
        ))}
      </div>
    </div>
  )
}
