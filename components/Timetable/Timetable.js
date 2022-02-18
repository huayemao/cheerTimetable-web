import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { map, pick } from 'lodash'
import { Cell } from './Cell'

const parseTime = (str) => {
  const day = parseInt(str[0], 10)
  const start = parseInt(str.slice(1, 3), 10)
  const end = parseInt(str.slice(3, 5), 10)
  return {
    day,
    start,
    end,
  }
}

export const parseLocation = (str = '') => {
  const [id, title] = str.split(',')
  return { id, title }
}

export const parseTeacher = (str = '') => {
  return str
    .split(',')
    .reduce(
      (acc, item, i, arr) =>
        i < arr.length / 2
          ? [...acc, { id: item, title: arr[arr.length / 2 + i] }]
          : acc,
      []
    )
}

export default function Timetable({ data, show7days }) {
  const router = useRouter()
  const { modal } = router.query
  const columnCount = show7days ? 7 : 5

  const emptyCells = Array.from(
    { length: show7days ? 42 : 30 },
    (e, i) => i + 1
  )

  const getCourses = useCallback(
    (row, col) => {
      const courses = data.filter((course) => {
        const { day, start } = parseTime(course.开课时间)
        if (!show7days && day > 5) {
          return false
        }
        return day === col && Math.ceil(start / 2) === row
      })
      return courses
    },
    [data, show7days]
  )

  const cells = emptyCells.map((e, i) =>
    getCourses(Math.ceil(e / columnCount), e % columnCount)
  )

  return (
    <div className="lg:mx-5">
      <div
        className={`grid grid-cols-5 gap-2 md:grid-cols-7 lg:gap-3`}
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
