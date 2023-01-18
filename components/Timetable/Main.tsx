import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
import { H2 } from '../H2'

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
      handleNavBack()
    }
  })

  const handleNavBack = () => {
    setModal('')
    const uri = window.location.toString()
    if (uri.indexOf('#') > 0) {
      const cleanURI = uri.substring(0, uri.indexOf('#'))
      window.history.replaceState({}, document.title, cleanURI)
    }
  }

  useEffect(() => {
    window.addEventListener('popstate', handleNavBack, true)
    return () => {
      window.removeEventListener('popstate', handleNavBack, true)
    }
  })

  useEffect(() => {
    const hash = window.location.hash
    if (hash.length > 1 && !modal) {
      const modal = hash.slice(1)
      setModal(modal)
    } else {
      setModal('')
    }
  }, [courses])

  useLayoutEffect(() => {
    if (!!modal) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [modal])

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
              if (!courses.length) {
                return
              }
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

      <div
        ref={ref}
        className={clsx(
          ' fixed bottom-0 -right-full z-10 h-[calc(100vh-4rem)] w-full overflow-auto bg-white bg-opacity-[.95] shadow-lg transition-all md:w-[50%] lg:w-[38%]',
          {
            '!right-0': modal,
          },
          'p-6'
        )}
      >
        <button onClick={handleNavBack}>
          <ArrowLongLeftIcon className="h-6 w-6 text-slate-500" />
        </button>
        {/* <h3 className="test">{course?.name}</h3> */}
        <div className="flex w-full justify-center ">
          <CourseDetail
            className="max-w-[308px] rounded bg-white shadow md:max-w-[364px]"
            course={activeCourses[0]}
          />
        </div>
        {/* todo: cell 里面的信息，弄个 portal 穿到这里来？，或者不用，直接可以读到信息 */}
      </div>
    </>
  )
})
