import qs from 'qs'
import { useCallback, useMemo } from 'react'
import { NextRouter } from 'next/router'
import Link from 'next/link'
import { mapValues, omit, map } from 'lodash'

import { CourseItem } from 'lib/types/CourseItem'
import Modal from 'components/common/Modal'
import List from 'components/common/List'
import { getWeekStr } from 'lib/getGridCells'
import { CourseDetail } from './CourseDetail'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  courses: CourseItem[]
  router: NextRouter
  num: number
}

// todo: 重写一下这个吧
export function CourseDetailModal({ courses, router, num }: Props) {
  const sp = useSearchParams()
  const modal = sp.get('modal')
  const seq = sp.get('seq')
  const isChoosing = courses.length > 1 && !seq
  const activeCourse =
    courses.length > 1 ? courses.find((e) => e.seq === seq) : courses[0]
  const courseTitle = activeCourse?.name

  const pathname = usePathname()

  const closeModal = useCallback(() => {
    // 怎样做到 如果有，就 pop
    const targetUrl =
      pathname +
      '/?' +
      qs.stringify(
        omit(
          {
            ...Object.fromEntries(sp.entries()),
            modal: num,
          },
          ['all', 'modal', 'seq']
        )
      )

    router.replace(
      targetUrl
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

// 显然这个还是坏的
const CourseChoose = ({ courses, router, num }: Props) => {
  const pathname = usePathname()
  return (
    <>
      {map(courses, (course: CourseItem) => {
        const href = `${pathname}?${qs.stringify({
          modal: num,
          seq: course.seq,
        })}`
        const weekStr = getWeekStr(course)

        return (
          <div key={course.seq}>
            <Link href={href} className="text-blue-500">
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
