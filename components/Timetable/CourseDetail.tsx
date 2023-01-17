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
      label: '开课编号',
      icon: IconHash,
      content: course?.courseId,
    },
    {
      label: '授课教师',
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
      label: '上课地点',
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
      label: '上课学生',
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
      label: '上课班级',
      icon: IconAcademic,
      content: course ? course.classId : null,
    },
    {
      label: '周次',
      icon: IconCalendar,
      content: course ? getWeekStr(course) : null,
    },
    {
      label: '类型',
      icon: IconCollection,
      content: course?.category,
    },
    {
      label: '学分',
      icon: IconCalculator,
      content: course ? (course.credit || '') + ' 学分' : null,
    },
  ]
  return (
    <div>
      <ul className="  text-gray-900">
        {list.map(({ icon: Icon, content, label }, i) => (
          <li
            key={i}
            className="relative inline-flex w-full items-center  rounded-t-lg py-2 px-4  text-xs  hover:bg-gray-100 md:text-sm"
          >
            <span className="flex flex-1 items-center font-semibold text-right w-full">
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </span>{' '}
            <span className="flex-1 w-full text-right">{content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
