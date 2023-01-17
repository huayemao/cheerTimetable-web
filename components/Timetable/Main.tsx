import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cn from 'clsx'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { Cell } from './Cell'
import s from './Main.module.css'
import { parseTime } from '../../lib/parseCourseFields'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import getGridCells from 'lib/getGridCells'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { CourseDetail } from './CourseDetail'
import useClickOutside from '@/lib/hooks/useClickOutside'

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
  const colCount = show7days ? 7 : 5
  const [modal, setModal] = useState('')

  const cells = useMemo(
    () => getGridCells(show7days, courses, colCount),
    [colCount, courses, show7days]
  )

  const activeCourses = (cells[modal]?.courses || []) as CourseItem[]
  const headerArr = show7days ? DAYS : DAYS.slice(0, -2)

  const ref = useRef(null)

  useClickOutside(ref, () => {
    if (!!modal) {
      history.back()
    }
  })

  const handleNavBack = (e) => {
    setModal('')
  }

  useEffect(() => {
    window.addEventListener('popstate', handleNavBack, true)

    return () => {
      window.removeEventListener('popstate', handleNavBack, true)
    }
  })

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
          <Cell
            handleNav={(num) => {
              window.history.pushState({ num }, '', `#${num}`)
              setModal(num)
            }}
            showModal={!!modal}
            key={`${i}${rowSpan}${courses?.[0]?.id || 0}`}
            num={i}
            courses={courses}
            rowSpan={rowSpan}
          />
        ))}
      </div>

      <div className="flex space-x-2">
        <div
          ref={ref}
          className={clsx(
            'fixed bottom-0 -right-full z-10 h-[calc(100vh-4rem)] w-full bg-white shadow transition-all lg:w-[42%]',
            {
              '!right-0': modal,
            },
            'p-6'
          )}
        >
          <button
            onClick={() => {
              history.back()
            }}
          >
            <ArrowLongLeftIcon className="h-6 w-6 " />
          </button>
          <h3 className="text-center text-xl"> {activeCourses[0]?.name}</h3>
          <CourseDetail course={activeCourses[0]} />
          {/* todo: cell 里面的信息，弄个 portal 穿到这里来？，或者不用，直接可以读到信息 */}
        </div>
        {/* 移动端的交互就用下滑把 */}
      </div>
    </>
  )
})
