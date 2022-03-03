import Link from 'next/link'
import cn from 'clsx'
import Modal from '../Modal'
import { useRouter } from 'next/router'
import { map, mapValues, omit, pick } from 'lodash'
import List from '../List'
import { parseLocation, parseTeacher } from '../../lib/parseCourseFields'
import s from './Timetable.module.css'
import { Info as IconInfo } from 'components/Icons'

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

const CourseChoose = ({ courseList, router, num }) => {
  return map(courseList, (course) => {
    const params = {
      pathname: router.asPath.split('?')[0],
      query: { modal: num, courseId: course.开课编号, seq: course.序号 },
    }
    return (
      <div>
        <Link href={params} shallow>
          <a className="">{course.开课课程}</a>
        </Link>
      </div>
    )
  })
}

export const Cell = ({ courses, onClick, showModal, num, rowSpan }) => {
  const isFirstRow = Math.floor(num / 7) === 0
  const isFirstCol = Math.floor(num % 7) === 0
  const router = useRouter()
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
      className={cn(s.cell, {
        [s['first-row']]: isFirstRow,
        [s['first-col']]: isFirstCol,
        'row-span-1': rowSpan === 1,
        'row-span-2': rowSpan === 2,
      })}
    >
      {courses[0] && (
        <>
          {map(cellData, (v, k) => (
            <div
              key={k}
              className={cn('max-w-full truncate  font-light md:text-sm', {
                [s['course-title']]: k === '开课课程',
                'text-xs': k === '上课周次',
              })}
            >
              {v}
            </div>
          ))}
        </>
      )}
      {showModal && courses.length && (
        <CourseDetailModal courses={courses} router={router} num={num} />
      )}
      {courses.length > 1 && (
        <div className="absolute top-0 right-0">
          <IconInfo className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
function CourseDetailModal({ courses, router, num }) {
  const { query } = router
  const { modal, courseId, seq } = query
  const isChoosing = courses.length > 1 && !courseId
  const activeCourse =
    courses.length > 1
      ? courses.find((e) => e.开课编号 === courseId && e.序号 === seq)
      : courses[0]
  const courseTitle = activeCourse?.开课课程

  const data = activeCourse
    ? mapValues(omit(activeCourse, ['序号', '操作', 'rowSpan']), getValue(true))
    : null

  return (
    <Modal
      title={isChoosing ? '选择课程' : courseTitle}
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
      {isChoosing && (
        <CourseChoose
          num={num}
          router={router}
          courseList={courses}
        ></CourseChoose>
      )}
      {!isChoosing && <List data={data} />}
    </Modal>
  )
}
