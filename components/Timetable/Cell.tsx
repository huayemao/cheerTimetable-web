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
  const { locationId, teacherIds } = course
  return (
    <>
      <div className={cn(s['course-preview'], s['course-title'])}>
        {course.name}
      </div>
      <div className={cn(s['course-preview'])}>
        {' '}
        <TextOrLink
          key={locationId}
          type={OwnerType.location}
          id={locationId}
        ></TextOrLink>
      </div>
      <div className={cn(s['course-preview'])}>
        {teacherIds.map((id, i, arr) => (
          <>
            <TextOrLink key={id} type={OwnerType.teacher} id={id} />
            {i < arr.length - 1 && '、'}
          </>
        ))}
      </div>
      <div className={cn(s['course-preview'], 'text-xs')}>{weekStr}</div>
    </>
  )
}

export const Cell = ({ courses, showModal, num, rowSpan }: CellProps) => {
  const router = useRouter()

  const isFirstRow = Math.floor(num / 7) === 0
  const isFirstCol = Math.floor(num % 7) === 0

  const hasCourse = courses.length > 0

  const handleNav = useCallback(() => {
    courses.length &&
      router.push(
        {
          pathname: router.asPath.split('?')[0],
          query: { modal: num },
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
