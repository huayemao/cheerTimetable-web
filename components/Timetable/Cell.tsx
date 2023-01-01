import cn from 'clsx'
import { useRouter } from 'next/router'
import s from './Timetable.module.css'
import { CourseDetailModal } from './CourseDetailModal'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import { getWeekStr } from 'lib/getGridCells'
import { useCallback } from 'react'
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
    <div className={s['course-preview']}>
      <div key={'name'} className={cn(s['course-title'])}>
        {course.name}
      </div>
      <div key={'location'}> {location.name}</div>
      <div key={'teachers'}>
        {teachers.map(({ id, name }, i, arr) => (
          <span key={id}>
            {name}
            {i < arr.length - 1 && '、'}
          </span>
        ))}
      </div>
      <div key={'weeks'} className={'text-xs'}>
        {weekStr}
      </div>
    </div>
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
          // 'border-t border-slate-300': isFirstRow,
          // 'border-l border-slate-300': isFirstCol,
          'row-span-1': rowSpan === 1,
          'row-span-2': rowSpan === 2,
        },
        'relative    hover:cursor-pointer '
      )}
    >
      {/* todo: 这个要改掉 */}
      {/* {courses.length > 1 && (
        <span
          className={
            'from-purle-400 absolute inset-0 -translate-y-1 translate-x-1 rounded-l-xl rounded-b-xl bg-gradient-to-bl from-slate-200/80 to-slate-50/10'
          }
        />
      )} */}
      <div
        className={cn(s.cell, 'h-full bg-white')}
      >
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
