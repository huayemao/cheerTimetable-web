import Link from 'next/link'
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

export function CourseDetail({ course }) {
  const list = [
    {
      icon: IconHash,
      content: course?.courseId,
    },
    {
      icon: IconUsers,
      content: course?.teachers.map(({ id, name }, i, arr) => (
        <div key={id}>
          <Link
            key={id || i}
            href={{
              pathname: `/schedule/${OwnerType.teacher}/${id}`,
            }}
            className="underline"
          >
            {name}
          </Link>
          {i < arr.length - 1 && '、'}
        </div>
      )),
    },
    {
      icon: IconLocation,
      content: course ? (
        course.location.name === '无' ? (
          '无上课地点信息'
        ) : (
          <Link
            className="underline"
            href={{
              pathname: `/schedule/${OwnerType.location}/${course.location.id}`,
            }}
          >
            {course.location.name}
          </Link>
        )
      ) : null,
    },
    {
      icon: IconGroup,
      content: (
        <Link
          className="underline"
          href={{
            pathname: `/courses/${course?.courseId}`,
          }}
        >
          {course?.studentCount + ' 人'}
        </Link>
      ),
    },
    {
      icon: IconAcademic,
      content: course ? course.classId : null,
    },
    {
      icon: IconCalendar,
      content: course ? getWeekStr(course) : null,
    },
    {
      icon: IconCollection,
      content: course?.category,
    },
    {
      icon: IconCalculator,
      content: course ? (course.credit || '') + ' 学分' : null,
    },
  ]
  return (
    <div>
      <ul className="space-y-1 text-gray-900">
        {list.map(({ icon: Icon, content }, i) => (
          <li
            key={i}
            className="relative inline-flex w-full items-center rounded-t-lg py-2  px-4 text-sm font-medium hover:bg-gray-100 md:text-lg"
          >
            <Icon className="mr-2 h-4 w-4" /> {content}
          </li>
        ))}
      </ul>
    </div>
  )
}
