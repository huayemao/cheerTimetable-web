import { useCallback, useState } from 'react'
import Link from 'next/link'
import Modal from '../Modal'
import { useRouter } from 'next/router'
import { map } from 'lodash'

const DataList = ({ isOrdered = false, data }) => {
  const list = map(data, (val, i) => (
    <li key={`${i}_${val}`}>
      <span>{i}</span>：{val}
    </li>
  ))
  return isOrdered ? <ol>{list}</ol> : <ul>{list}</ul>
}

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

const Cell = ({ courses, onClick }) => {
  const { id: locationId, title: locationTitle } = parseLocation(
    courses[0]?.上课地点
  )

  return (
    <div
      onClickCapture={onClick}
      className="flex flex-col items-center justify-center rounded-l-xl rounded-b-xl border border-blue-500 px-1 py-2 text-sm text-blue-500 hover:bg-blue-50 focus:outline-none dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {courses[0] && (
        <>
          <div className="max-w-full truncate">{courses[0]?.开课课程}</div>
          <div className="max-w-full truncate">
            <Link href={`/curriculum/location/${locationId}`}>
              <a className="hover:underline">{locationTitle}</a>
            </Link>
          </div>
          <div className="max-w-full truncate">
            {parseTeacher(courses[0].授课教师).map(({ id, title }, i, arr) => (
              <span key={id}>
                <Link href={`/curriculum/teacher/${id}`}>
                  <a className="hover:underline">{title}</a>
                </Link>
                {i < arr.length - 1 && `、`}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
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
    [data]
  )

  const cells = emptyCells.map((e, i) =>
    getCourses(Math.ceil(e / columnCount), e % columnCount)
  )

  return (
    <div className="lg:mx-5">
      <div
        className={`grid grid-cols-5 gap-2 lg:grid-cols-7 lg:gap-3`}
        style={{ gridAutoRows: '1fr' }}
      >
        {cells.map((e, i) => (
          <Cell
            onClick={() => {
              cells[i].length &&
                router.push(
                  {
                    pathname: router.asPath,
                    query: { modal: i },
                  },
                  undefined,
                  { shallow: true }
                )
            }}
            key={i}
            courses={e}
          />
        ))}
      </div>
      {modal && cells[modal].length && (
        <Modal
          title={cells[modal][0].开课课程}
          onClose={() => {
            router.replace(
              {
                pathname: router.asPath.split('?')[0],
              },
              undefined,
              { shallow: true }
            )
          }}
        >
          <DataList data={cells[modal][0]} />
        </Modal>
      )}
    </div>
  )
}
