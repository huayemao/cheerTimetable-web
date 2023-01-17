import qs from 'qs'
import cn from 'clsx'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import s from './Main.module.css'
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
  handleNav: (num: number) => void
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

export const Cell = ({
  courses,
  showModal,
  num,
  rowSpan,
  handleNav,
}: CellProps) => {
  const router = useRouter()
  const sp = useSearchParams()
  const modal = sp.get('modal')
  const pathname = usePathname()

  const isFirstRow = Math.floor(num / 7) === 0
  const isFirstCol = Math.floor(num % 7) === 0

  const hasCourse = courses.length > 0
  const multiCourse = courses.length > 1

  return (
    <div
      onClickCapture={() => {
        handleNav(num)
      }}
      className={cn(
        s.cell,
        'h-full',
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
      {courses.length > 1 && (
        <div className="absolute bottom-1 right-1 h-[.75em] w-[.75em]  font-thin md:bottom-2 md:right-2">
          <ArrowTopRightOnSquareIcon className="text-xs font-thin" />
        </div>
      )}
      {hasCourse && (
        <>
          <LessonPreview course={courses[0]} />
          {/* {showModal && (
            <CourseDetailModal courses={courses} router={router} num={num} />
          )} */}
        </>
      )}
    </div>
  )
}
