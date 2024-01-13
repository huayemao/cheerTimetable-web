import { getWeekStr } from '@/lib/client/getGridCells'
import { CourseItem } from '@/lib/types/CourseItem'
import {
  Academic as IconAcademic,
  Calculator as IconCalculator,
  Calendar as IconCalendar,
  Collection as IconCollection,
  Group as IconGroup,
  Hash as IconHash,
  Location as IconLocation,
  Users as IconUsers
} from 'components/Icons'
import { OwnerType } from 'lib/types/Owner'
import Link from 'next/link'
import Materials from '../Materials'

export function CourseDetail({
  course,
  className = '',
}: {
  course: CourseItem
  className?: string
}) {
  // todo: 这里面要考虑是否加上 slot
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
        <span key={id}>
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
        </span>
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

  // todo: 从这里面找样式
  // https://app.haikei.app/
  // https://omatsuri.app/gradient-generator
  // 随机去分配背景图（封面）
  return (
    <div className={className}>
      <div className="gradient text-white flex justify-center items-center flex-col rounded-t h-24">
        <h3 className="font-semibold ">{course?.name}</h3>
        <span>{course?.term}</span>
        <Materials></Materials>
      </div>
      <ul className="  divide-y px-4 py-2 text-gray-900">
        {list.map(({ icon: Icon, content, label }, i) => (
          <li
            key={i}
            className="relative inline-flex w-full items-center py-2 px-2 text-xs  hover:bg-gray-100 md:text-sm"
          >
            <span className="flex w-full flex-1 items-center text-right font-semibold">
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </span>{' '}
            <span className="w-full flex-[2] text-right font-light">
              {content}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
