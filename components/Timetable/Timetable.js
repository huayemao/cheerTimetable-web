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
    <div className="flex flex-col items-center justify-center rounded-l-xl rounded-b-xl border border-blue-500 py-2 text-sm text-blue-500 hover:bg-blue-50 focus:outline-none dark:hover:bg-slate-900 dark:hover:text-white">
      {courses[0] && (
        <>
          <div>{courses[0]?.开课课程}</div>
          <div>
            <Link href={`/curriculum/location/${locationId}`}>
              <a className="hover:underline">{locationTitle}</a>
            </Link>
          </div>
          <div className="max-w-full truncate">
            {parseTeacher(courses[0].授课教师).map(({ id, title }, i, arr) => (
              <div key={id}>
                <Link href={`/curriculum/teacher/${id}`}>
                  <a className="hover:underline">{title}</a>
                </Link>
                {i < arr.length - 1 && `、`}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Timetable({ data, show7days }) {
  const cells = Array.from({ length: show7days ? 42 : 30 }, (e, i) => i + 1)

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
    [data]
  )

  const columnCount = show7days ? 7 : 5

  return (
    <div className="mx-2 lg:mx-20">
      <div
        className={`grid grid-cols-5 gap-3 lg:grid-cols-7`}
        style={{ gridAutoRows: '1fr' }}
      >
        {cells.map((e, i) => (
          <Cell
            key={i}
            courses={getCourses(Math.ceil(e / columnCount), e % columnCount)}
          />
        ))}
      </div>
    </div>
  )
}
