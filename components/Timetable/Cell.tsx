import cn from 'clsx'
import { useRouter } from 'next/router'
import { map, mapValues, pick } from 'lodash'
import { parseLocation } from '../../lib/parseCourseFields'
import s from './Timetable.module.css'
import { Info as IconInfo } from 'components/Icons'
import { CourseDetailModal } from './CourseDetailModal'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import { OwnerType } from 'lib/types/Owner'
import { getWeekStr } from 'lib/getGridCells'
import { useCallback } from 'react'
import Link from 'next/link'
import { omit } from 'lodash'

type CellProps = {
  courses: CourseItem[]
  showModal: boolean
  num: number
  rowSpan: number
}

type LessonPreviewProps = {
  course: CourseItem
}

export default function LessonPreview({ course }: LessonPreviewProps) {
  const weekStr = getWeekStr(course)
  const { location, teachers } = course
  return (
    <>
      <div key={'name'} className={cn(s['course-preview'], s['course-title'])}>
        {course.name}
      </div>
      <div key={'location'} className={cn(s['course-preview'])}>
        {' '}
        {location.name}
      </div>
      <div key={'teachers'} className={cn(s['course-preview'])}>
        {teachers.map(({ id, name }, i, arr) => (
          <span key={id}>
            {name}
            {i < arr.length - 1 && '、'}
          </span>
        ))}
      </div>
      <div key={'weeks'} className={cn(s['course-preview'], 'text-xs')}>
        {weekStr}
      </div>
    </>
  )
}

export const Cell = ({ courses, showModal, num, rowSpan }: CellProps) => {
  const router = useRouter()

  const isFirstRow = Math.floor(num / 7) === 0
  const isFirstCol = Math.floor(num % 7) === 0

  const hasCourse = courses.length > 0
  const multiCourse = courses.length > 1

  const handleNav = useCallback(() => {
    !router.query.modal &&
      courses.length &&
      router.push(
        {
          pathname: router.asPath.split('?')[0],
          query: { ...omit(router.query, 'all'), modal: num },
        },
        undefined,
        { shallow: true }
      )
  }, [courses.length, num, router])

  return (
    <div
      onClickCapture={handleNav}
      className={cn(
        {
          [s['first-row']]: isFirstRow,
          [s['first-col']]: isFirstCol,
          'row-span-1': rowSpan === 1,
          'row-span-2': rowSpan === 2,
        },
        'relative  hover:cursor-pointer'
      )}
    >
      {courses.length > 1 && (
        <span
          className={
            'from-purle-400 absolute inset-0 -translate-y-1 translate-x-1 rounded-l-xl rounded-b-xl bg-gradient-to-bl from-blue-200/80 to-blue-50/10'
          }
        ></span>
      )}
      <div className={cn(s.cell, 'h-full bg-white')}>
        {hasCourse && (
          <>
            <LessonPreview course={courses[0]} />
            {showModal && (
              <CourseDetailModal courses={courses} router={router} num={num} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
