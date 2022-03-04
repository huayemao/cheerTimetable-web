import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { map, pick } from 'lodash'
import cn from 'clsx'
import { Cell } from './Cell'
import s from './Timetable.module.css'
import { parseTime } from '../../lib/parseCourseFields'

export default function Timetable({ courses, show7days }) {
  const router = useRouter()
  const { modal } = router.query
  const columnCount = show7days ? 7 : 5

  const emptyCells = Array.from(
    { length: show7days ? 42 : 30 },
    (e, i) => i + 1
  )

  const getCourses = useCallback(
    (row, col) => {
      const data = courses
        .filter((course) => {
          const { day, start, end } = parseTime(course.开课时间)
          if (!show7days && day > 5) {
            return false
          }
          return day === col && Math.ceil(start / 2) === row
        })
        .map((course) => {
          const 上课周次 =
            course.上课周次 +
            ' ' +
            (course.单双周 === '全部' ? '周' : course.单双周)
          if (course) {
            const { day, start, end } = parseTime(course.开课时间)
            const rowSpan = Math.ceil((end - start) / 2)
            return { ...course, rowSpan, 上课周次 }
          } else {
            return course
          }
        })
      return data
    },
    [courses, show7days]
  )

  const cells = emptyCells.map((e, i) =>
    getCourses(
      Math.ceil(e / columnCount),
      e % columnCount === 0 && e >= columnCount ? columnCount : e % columnCount
    )
  )

  const getRowSpan = (courses) => {
    return courses.reduce((maxSpan, item) => Math.max(maxSpan, item.rowSpan), 0)
  }
  const rowSpanInfo = cells.map(getRowSpan)

  return (
    <div className="lg:mx-5">
      <div
        className={cn(s.timetable, {
          [s['show-7-days']]: show7days,
        })}
        style={{ gridAutoRows: '1fr' }}
      >
        {cells.map((e, i) =>
          rowSpanInfo[i - columnCount] === 2 && !e.length ? null : (
            <Cell
              showModal={parseInt(modal, 10) === i}
              key={i}
              num={i}
              courses={e}
              rowSpan={rowSpanInfo[i]}
            />
          )
        )}
      </div>
    </div>
  )
}
