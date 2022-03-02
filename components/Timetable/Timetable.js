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

  console.log(emptyCells.length)

  const getCourses = useCallback(
    (row, col) => {
      const data = courses.filter((course) => {
        const { day, start } = parseTime(course.开课时间)
        if (!show7days && day > 5) {
          return false
        }

        const isTheDay = day === col || day === columnCount
        const isThePeriod = Math.ceil(start / 2) === row

        return isTheDay && isThePeriod
      })
      return data
    },
    [columnCount, courses, show7days]
  )

  const cells = emptyCells.map((e, i) =>
    getCourses(Math.ceil(e / columnCount), e % columnCount)
  )

  console.log(cells)

  return (
    <div className="lg:mx-5">
      <div
        className={cn(s.timetable, {
          [s['show-7-days']]: show7days,
        })}
        style={{ gridAutoRows: '1fr' }}
      >
        {cells.map((e, i) => (
          <Cell
            showModal={parseInt(modal, 10) === i}
            key={i}
            num={i}
            courses={e}
          />
        ))}
      </div>
    </div>
  )
}
