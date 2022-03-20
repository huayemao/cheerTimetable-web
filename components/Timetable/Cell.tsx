import cn from 'clsx'
import { useRouter } from 'next/router'
import { map, mapValues, pick } from 'lodash'
import { parseLocation, parseTeacher } from '../../lib/parseCourseFields'
import s from './Timetable.module.css'
import { Info as IconInfo } from 'components/Icons'
import { CourseDetailModal } from './CourseDetailModal'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import { OwnerType } from 'lib/types/Owner'
import { getWeekStr } from 'lib/getGridCells'
import { TextOrLink } from './TextOrLink'
import { useCallback } from 'react'
import Link from 'next/link'
import { omit } from 'lodash'

type CellProps = {
  courses: CourseItem[]
  showModal: boolean
  num: number
  rowSpan: number
}

type CoursePreviewProps = {
  course: CourseItem
}

export default function CoursePreview({ course }: CoursePreviewProps) {
  const weekStr = getWeekStr(course)
  const { locationId, teachers } = course
  return (
    <>
      <div key={'name'} className={cn(s['course-preview'], s['course-title'])}>
        {course.name}
      </div>
      <div key={'location'} className={cn(s['course-preview'])}>
        {' '}
        <TextOrLink
          key={locationId}
          type={OwnerType.location}
          id={locationId}
        ></TextOrLink>
      </div>
      <div key={'teachers'} className={cn(s['course-preview'])}>
        {teachers.map(({ id, name }, i, arr) => (
          <>
            {name}
            {i < arr.length - 1 && '、'}
          </>
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
      className={cn(s.cell, {
        [s['first-row']]: isFirstRow,
        [s['first-col']]: isFirstCol,
        'row-span-1': rowSpan === 1,
        'row-span-2': rowSpan === 2,
      })}
    >
      {hasCourse && (
        <>
          <CoursePreview course={courses[0]} />
          {courses.length > 1 && (
            <div className="absolute top-0 right-0">
              <IconInfo className="h-4 w-4" />
            </div>
          )}
          {showModal && (
            <CourseDetailModal courses={courses} router={router} num={num} />
          )}
        </>
      )}
    </div>
  )
}
