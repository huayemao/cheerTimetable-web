import { useCallback } from 'react'
import Link from 'next/link'

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

const parseLocation = (str = '') => {
  const [id, title] = str.split(',')
  return { id, title }
}

const parseTeacher = (str = '') => {
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

const Cell = ({ courses }) => {
  const { id: locationId, title: locationTitle } = parseLocation(
    courses[0]?.上课地点
  )

  return (
    <div className="rounded-lg border-2 border-gray-200 border-opacity-50 p-4 text-xs text-gray-500">
      {courses[0] && (
        <>
          <div>{courses[0]?.开课课程}</div>
          <div>
            <Link href={`/curriculum/location/${locationId}`}>
              <a className="text-indigo-500">{locationTitle}</a>
            </Link>
          </div>
          {parseTeacher(courses[0].授课教师).map(({ id, title }, i, arr) => (
            <>
              <Link href={`/curriculum/teacher/${id}`}>
                <a className="text-indigo-500">{title}</a>
              </Link>
              {i < arr.length - 1 && `、`}
            </>
          ))}
        </>
      )}
    </div>
  )
}

export function Timetable({ data }) {
  const cells = Array.from({ length: 42 }, (e, i) => i + 1)

  const getCourses = useCallback(
    (row, col) => {
      const courses = data.filter((course) => {
        const { day, start } = parseTime(course.开课时间)
        return day === col && Math.ceil(start / 2) === row
      })
      return courses
    },
    [data]
  )
  return (
    <div className="">
      <div className="grid grid-cols-7 gap-4" style={{ gridAutoRows: '1fr' }}>
        {cells.map((e, i) => (
          <Cell key={i} courses={getCourses(Math.ceil(e / 7), (e % 7) + 1)} />
        ))}
      </div>
    </div>
  )
}
