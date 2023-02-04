'use client'
import {
  forwardRef,
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
import { parseTime } from '../../lib/client/parseCourseFields'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import getGridCells from '@/lib/client/getGridCells'
import { usePathname, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { CourseDetail } from './CourseDetail'
import useClickOutside from '@/lib/hooks/useClickOutside'
import { H2 } from '../H2'
import Carousel from 'nuka-carousel'

type TimetableProps = {
  courses: CourseItem[]
  show7days: boolean
}

type Cell = {
  courses: CourseItem[]
  rowSpan: number
}

export const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// todo: Mini Card
// todo: 如果没有课，默认折叠最后一行
// todo: 无课表课程
export default memo(function Timetable({ courses, show7days }: TimetableProps) {
  const colCount = show7days ? 7 : 5
  const [modal, setModal] = useState<number | string>('')

  const cells = useMemo(
    () => getGridCells(show7days, courses, colCount),
    [colCount, courses, show7days]
  )

  const activeCourses = (cells[modal]?.courses || []) as CourseItem[]
  const headerArr = show7days ? DAYS : DAYS.slice(0, -2)

  const ref = useRef(null)

  const hasSelectedCourse = !!modal || modal === 0

  useClickOutside(ref, () => {
    if (hasSelectedCourse) {
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

  const pathname = usePathname()

  useEffect(() => {
    // 这里得等一下，否则课表跳转后 offcanvs 的状态仍然保持
    setTimeout(() => {
      const hash = window.location.hash
      if (hash.length > 1 && !modal) {
        const modal = hash.slice(1)
        setModal(modal)
      } else {
        setModal('')
      }
    }, 100)
  }, [courses, pathname])

  useLayoutEffect(() => {
    if (hasSelectedCourse) {
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
            showModal={hasSelectedCourse}
            key={`${i}${rowSpan}${courses?.[0]?.id || 0}`}
            num={i}
            courses={courses}
            rowSpan={rowSpan}
          />
        ))}
      </div>

      <OffCanvas open={hasSelectedCourse} ref={ref}>
        <button
          className="test p-2 text-2xl font-bold text-transparent"
          style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}
          onClick={handleNavBack}
        >
          {/* 返回 */}⟵
          {/* <ArrowLongLeftIcon className="h-6 w-6 test text-transparent" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}/> */}
        </button>
        {/* <h3 className="test">{course?.name}</h3> */}
        <div className="flex w-full justify-center ">
          {activeCourses.length > 1 ? (
            <Carousel
              className="max-w-[100vw]"
              renderBottomCenterControls={({
                slideCount,
                currentSlide,
                goToSlide,
              }) => {
                return (
                  <div className="relative top-4 flex gap-2">
                    {Array.from({ length: slideCount }, (_, i) => i).map(
                      (e) => (
                        <div
                          className={clsx(
                            'h-2 w-2 rounded-full bg-clip-padding p-1 ring-2 ring-slate-300',
                            {
                              'bg-slate-400': currentSlide === e,
                            }
                          )}
                          key={e}
                          onClick={() => goToSlide(e)}
                        />
                      )
                    )}
                  </div>
                )
              }}
              renderCenterRightControls={null}
              renderCenterLeftControls={null}
            >
              {activeCourses.map((c) => (
                <div className="flex justify-center p-2" key={c.courseId}>
                  <CourseDetail
                    className="max-w-[308px] rounded bg-white shadow md:max-w-[364px]"
                    course={c}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div
              className="flex justify-center p-2"
              key={activeCourses[0]?.courseId}
            >
              <CourseDetail
                className="max-w-[308px] rounded bg-white shadow md:max-w-[364px]"
                course={activeCourses[0]}
              />
            </div>
          )}
        </div>
      </OffCanvas>
    </>
  )
})

// eslint-disable-next-line react/display-name
const OffCanvas = forwardRef(({ children, open }, myRef) => {
  return (
    <div
      ref={myRef}
      className={clsx(
        ' fixed bottom-0 -right-full z-10 h-[calc(100vh-4rem)] w-full overflow-auto bg-white bg-opacity-[.95] shadow-lg transition-all md:w-[50%] lg:w-[38%]',
        {
          '!right-0': open,
        },
        'p-6'
      )}
    >
      {children}
    </div>
  )
})
