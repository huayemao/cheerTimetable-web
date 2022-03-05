import { useCallback, useMemo } from 'react'
import { NextRouter } from 'next/router'
import Link from 'next/link'
import { mapValues, omit, map } from 'lodash'

import { CourseItem } from 'lib/types/CourseItem'
import Modal from 'components/Modal'
import List from 'components/List'
import {
  Location as IconLocation,
  Group as IconGroup,
  Users as IconUsers,
  Calendar as IconCalendar,
  Hash as IconHash,
} from 'components/Icons'
import { getWeekStr } from 'lib/getGridCells'
import { TextOrLink } from './TextOrLink'
import { OwnerType } from 'lib/types/Owner'

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
      },
      undefined,
      { shallow: true }
    )
  }, [router])

  const list = [
    {
      icon: IconHash,
      content: activeCourse?.courseId,
    },
    {
      icon: IconUsers,
      content: activeCourse?.teacherIds.map((id, i, arr) => (
        <>
          <TextOrLink canLink key={id || i} type={OwnerType.teacher} id={id} />
          {i < arr.length - 1 && '、'}
        </>
      )),
    },
    {
      icon: IconLocation,
      content: activeCourse ? (
        <TextOrLink
          canLink
          type={OwnerType.location}
          id={activeCourse.locationId}
        />
      ) : null,
    },
    {
      icon: IconGroup,
      content: activeCourse?.studentCount + ' 人',
    },
    {
      icon: IconCalendar,
      content: activeCourse ? getWeekStr(activeCourse) : null,
    },
  ]

  return (
    <Modal title={isChoosing ? '选择课程' : courseTitle} onClose={closeModal}>
      {isChoosing && (
        <CourseChoose num={num} router={router} courses={courses} />
      )}
      {!isChoosing && (
        <div>
          <ul className="space-y-1 text-gray-900">
            {list.map(({ icon: Icon, content }, i) => (
              <li
                key={i}
                className="relative inline-flex w-full items-center rounded-t-lg  py-2 px-4 text-sm font-medium hover:bg-gray-100"
              >
                <Icon className="mr-2 h-4 w-4" /> {content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  )
}

const CourseChoose = ({ courses, router, num }: Props) => {
  return map(courses, (course: CourseItem) => {
    const params = {
      pathname: router.asPath.split('?')[0],
      query: { modal: num, seq: course.seq },
    }
    const weekStr = getWeekStr(course)

    return (
      <div key={course.seq}>
        <Link href={params} shallow>
          <a className="text-blue-500">
            {course.name}{' '}
            <span className="text-sm font-light text-gray-500">{weekStr}</span>
          </a>
        </Link>
      </div>
    )
  })
}
