import { useCallback, useMemo } from 'react'
import { NextRouter } from 'next/router'
import Link from 'next/link'
import { mapValues, omit } from 'lodash'

import { CourseItem } from 'lib/types/CourseItem'
import Modal from 'components/common/Modal'
import List from 'components/common/List'
import {
  Location as IconLocation,
  Group as IconGroup,
  Users as IconUsers,
  Calendar as IconCalendar,
  Hash as IconHash,
  Academic as IconAcademic,
  Calculator as IconCalculator,
  Collection as IconCollection,
} from 'components/Icons'
import { getWeekStr } from 'lib/getGridCells'
import { OwnerType } from 'lib/types/Owner'
import Drawer from 'rc-drawer'
import { XIcon } from '@heroicons/react/solid'
import { CourseChoose } from './CourseChoose'

export type Props = {
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
      content: (
        <div className="">
          {activeCourse?.teachers.map(({ id, name }, i, arr) => (
            <span key={id || i}>
              <Link
                href={{
                  pathname: `/curriculum/${OwnerType.teacher}/${id}`,
                }}
              >
                <a className="underline">{name}</a>
              </Link>
              {i < arr.length - 1 && '、'}
            </span>
          ))}
        </div>
      ),
    },
    {
      icon: IconLocation,
      content: activeCourse ? (
        activeCourse.location.name === '无' ? (
          '无上课地点信息'
        ) : (
          <Link
            href={{
              pathname: `/curriculum/${OwnerType.location}/${activeCourse.location.id}`,
            }}
          >
            <a className="underline">{activeCourse.location.name}</a>
          </Link>
        )
      ) : null,
    },
    {
      icon: IconGroup,
      content: (
        <Link
          href={{
            pathname: `/courses/${activeCourse?.courseId}`,
          }}
        >
          <a className="underline">{activeCourse?.studentCount + ' 人'}</a>
        </Link>
      ),
    },
    {
      icon: IconAcademic,
      content: activeCourse ? activeCourse.classId : null,
    },
    {
      icon: IconCalendar,
      content: activeCourse ? getWeekStr(activeCourse) : null,
    },
    {
      icon: IconCollection,
      content: activeCourse?.category,
    },
    {
      icon: IconCalculator,
      content: activeCourse ? (activeCourse.credit || '') + ' 学分' : null,
    },
  ]

  const content = (
    <div className="space-y-6 p-6 pt-16 text-base leading-relaxed text-gray-500 lg:pt-4">
      {isChoosing && (
        <CourseChoose num={num} router={router} courses={courses} />
      )}
      {!isChoosing && (
        <div>
          <ul className="space-y-1 text-gray-900">
            {list.map(({ icon: Icon, content: item }, i) => (
              <li
                key={i}
                className="relative inline-flex w-full items-center rounded-t-lg py-2  px-4 text-sm font-medium hover:bg-gray-100 md:text-lg"
              >
                <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Drawer
        keyboard
        className="lg:hidden"
        contentWrapperStyle={{
          borderTopRightRadius: '20px',
          borderTopLeftRadius: '20px',
        }}
        maskClosable
        handler={
          <div className="absolute top-4 right-4 z-10">
            <XIcon className="h-6 w-6 text-gray-600" />
          </div>
        }
        level={'#__next'}
        open
        levelMove={1}
        getContainer={'body'}
        placement={'bottom'}
        onHandleClick={closeModal}
        height={'60vh'}
      >
        <h3 className="absolute top-4 left-4 text-lg font-semibold text-gray-900 lg:text-xl">
          {isChoosing ? '选择课程' : courseTitle}
        </h3>
        <div className="absolute top-0 flex w-full justify-center">
          <div className="h-2 w-[18%] rounded-2xl rounded-t-none bg-slate-300 shadow-lg shadow-slate-300" />
        </div>
        {content}
      </Drawer>
      <div className="hidden lg:block">
        <Modal
          title={isChoosing ? '选择课程' : courseTitle}
          onClose={closeModal}
        >
          {content}
        </Modal>
      </div>
    </>
  )
}
