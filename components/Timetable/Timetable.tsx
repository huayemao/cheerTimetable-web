import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { map, pick } from 'lodash'
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

export default function Timetable({ courses, show7days }: TimetableProps) {
  const router = useRouter()
  const modal: string = router.query.modal as string
  const colCount = show7days ? 7 : 5

  const cells = useMemo(
    () => getGridCells(show7days, courses, colCount),
    [colCount, courses, show7days]
  )

  return (
    <div className="lg:mx-5">
      <div
        className={cn(s.timetable, {
          [s['show-7-days']]: show7days,
        })}
        style={{ gridAutoRows: '1fr' }}
      >
        {cells.map(({ courses, rowSpan }, i, arr) =>
          arr[i - colCount]?.rowSpan === 2 && !courses.length ? null : (
            <Cell
              showModal={parseInt(modal, 10) === i}
              key={i}
              num={i}
              courses={courses}
              rowSpan={rowSpan}
            />
          )
        )}
      </div>
    </div>
  )
}
