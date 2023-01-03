import { useCallback, useMemo } from 'react'
import { NextRouter } from 'next/router'
import Link from 'next/link'
import { mapValues, omit, map } from 'lodash'

import { CourseItem } from 'lib/types/CourseItem'
import Modal from 'components/common/Modal'
import List from 'components/common/List'
import { getWeekStr } from 'lib/getGridCells'
import { CourseDetail } from './CourseDetail'

type Props = {
  courses: CourseItem[]
  router: NextRouter
  num: number
}

export function CourseDetailModal({ courses, router, num }: Props) {
  const { query } = router
  const { modal, seq } = query
  const isChoosing = courses.length > 1 && !seq
  const activeCourse =
    courses.length > 1 ? courses.find((e) => e.seq === seq) : courses[0]
  const courseTitle = activeCourse?.name

  const closeModal = useCallback(() => {
    router.replace(
      {
        pathname: router.asPath.split('?')[0],
        query: omit(router.query, ['all', 'modal', 'seq']),
      },
      undefined
      // { shallow: true }
    )
  }, [router])

  return (
    <Modal title={isChoosing ? '选择课程' : courseTitle} onClose={closeModal}>
      {isChoosing && (
        <CourseChoose num={num} router={router} courses={courses} />
      )}
      {!isChoosing && <CourseDetail course={activeCourse}></CourseDetail>}
    </Modal>
  )
}

const CourseChoose = ({ courses, router, num }: Props) => {
  return (
    <>
      {map(courses, (course: CourseItem) => {
        const params = {
          pathname: router.asPath.split('?')[0],
          query: { ...omit(router.query, 'all'), modal: num, seq: course.seq },
        }
        const weekStr = getWeekStr(course)

        return (
          <div key={course.seq}>
            <Link href={params} className="text-blue-500">
              {course.name}{' '}
              <span className="text-sm font-light text-gray-500">
                {weekStr}
              </span>
            </Link>
          </div>
        )
      })}
    </>
  )
}
