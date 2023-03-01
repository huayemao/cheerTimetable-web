'use client'
import { forwardRef, memo, useMemo, useRef, useState } from 'react'
import cn from 'clsx'
import s from './Main.module.css'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import getGridCells, { getWeekStr } from '@/lib/client/getGridCells'
import clsx from 'clsx'
import { DAYS } from './Main'

type TimetableProps = {
  courses: CourseItem[]
  show7days: boolean
}

export default memo(function MiniSchedule({
  courses,
  show7days,
}: TimetableProps) {
  const colCount = show7days ? 7 : 5
  const [modal, setModal] = useState<number | string>('')

  const headerArr = show7days ? DAYS : DAYS.slice(0, -2)

  const cells = useMemo(
    () => getGridCells(show7days, courses, colCount),
    [colCount, courses, show7days]
  )

  return (
    <div className="gradient max-w-[308px] rounded p-2 md:max-w-[364px] md:p-4">
      <div
        className={cn(
          s.timetable,
          {
            [s['show-7-days']]: show7days,
          },
          'items-stretch !gap-2 !bg-transparent'
        )}
      >
        {headerArr.map((e) => (
          <div
            key={e}
            className={
              'grid-grow-0 w-full place-self-center text-center text-sm font-semibold leading-[2em] text-white'
            }
          >
            {e}
          </div>
        ))}
        {cells.map(({ courses, rowSpan }, i, arr) => (
          <div
            key={i}
            className={clsx(
              {
                'row-span-1': rowSpan === 1,
                'row-span-2': rowSpan === 2,
              },
              'rounded bg-[rgba(255,255,255,.82)] shadow md:min-h-[42px] md:min-w-[42px]'
            )}
          >
            {courses.length ? (
              <div
                className="gradient flex h-full w-full flex-col items-center justify-center rounded p-1 text-lg font-semibold text-transparent"
                title={courses.map((e) => getWeekStr(e))}
                style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}
              >
                {courses[0].name.slice(0, 1)}
                {/* <span className='text-xs'>{courses.map((e) => getWeekStr(e))}</span> */}
              </div>
            ) : (
              <div className=""></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})
