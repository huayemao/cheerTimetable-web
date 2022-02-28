import Link from 'next/link'
import cn from 'clsx'
import Modal from '../Modal'
import { useRouter } from 'next/router'
import { map, mapValues, omit, pick } from 'lodash'
import List from '../List'
import { parseLocation, parseTeacher } from '../../lib/parseCourseFields'
import s from './Timetable.module.css'

export const Cell = ({ courses, onClick, showModal, num }) => {
  const isFirstRow = Math.floor(num / 7) === 0
  const isFirstCol = Math.floor(num % 7) === 0
  const router = useRouter()
  const transformer = {
    授课教师: (v, withLink = false) =>
      parseTeacher(v).map(({ id, title }, i, arr) => (
        <span key={id}>
          {withLink ? (
            <Link href={`/curriculum/teacher/${id}`}>
              <a className="underline">{title}</a>
            </Link>
          ) : (
            title
          )}

          {i < arr.length - 1 && `、`}
        </span>
      )),
    上课地点: (v, withLink = false) => {
      const { id: locationId, title: locationTitle } = parseLocation(v)
      return withLink ? (
        <Link href={`/curriculum/location/${locationId}`}>
          <a className="underline">{locationTitle}</a>
        </Link>
      ) : (
        locationTitle
      )
    },
  }

  const getValue = (withLink) => (v, k) => {
    const fn = transformer[k]
    return fn ? fn(v, withLink) : v
  }

  const modalData = courses[0]
    ? mapValues(omit(courses[0], ['序号', '操作']), getValue(true))
    : null

  const cellData = courses[0]
    ? mapValues(
        pick(courses[0], ['开课课程', '上课地点', '授课教师', '上课周次']),
        getValue(false)
      )
    : null

  const params = [
    {
      pathname: router.asPath.split('?')[0],
      query: { modal: num },
    },
    undefined,
    { shallow: true },
  ]

  return (
    <div
      onClickCapture={() => {
        courses.length && router.push(...params)
      }}
      className={cn(
        'flex flex-col items-center justify-center px-1 py-2 text-sm text-blue-500 hover:bg-blue-50 focus:outline-none',
        {
          [s['first-row']]: isFirstRow,
          [s['first-col']]: isFirstCol,
          [s.cell]: true,
        }
      )}
    >
      {courses[0] && (
        <>
          {map(cellData, (v, k) => (
            <div
              key={k}
              className={cn('max-w-full font-light', {
                [s['course-title']]: k === '开课课程',
                truncate: k !== '开课课程',
              })}
            >
              {v}
            </div>
          ))}
        </>
      )}
      {showModal && courses.length && (
        <Modal
          title={courses[0].开课课程}
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
          <List data={modalData} />
        </Modal>
      )}
    </div>
  )
}
