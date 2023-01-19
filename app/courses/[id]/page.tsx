import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from 'components/common/Layout'
import Head from 'next/head'
import List from 'components/common/List'
import { parseCourseItemByLesson } from '@/lib/utils/parseCourseItemByLesson'
import { CourseDetail } from 'components/Timetable/CourseDetail'
import { SubjectPreview } from 'components/PreviewCards/SubjectPreview'
import LessonPreview from 'components/Timetable/Cell'
import { getCourseById } from '../../../lib/service/getCourseById'
import { Students } from 'app/search/page'
import { H2 } from '@/components/H2'

export default async function CoursePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const course = await getCourseById(id)
  const courseItems = course?.lessons.map(parseCourseItemByLesson)

  if (id === '[id]') {
    return null
  }

  if (!courseItems?.length) {
    return null
  }

  const label = course ? course.subject.name : null

  // todo: 这个其实应该是个课表视图（mini schedule）
  return (
    <>
      {!!courseItems[0] && (
        <H2 title={'开课信息'} slate>
          <div className="flex gap-4">
            {courseItems?.map((c) => (
              <CourseDetail
                key={c.courseId + c.slot}
                className="max-w-[308px] rounded bg-white shadow md:max-w-[364px]"
                course={c}
              />
            ))}
          </div>
        </H2>
      )}
      <H2
        slate
        title={
          <>
            教学班 - {course.className}（{course?.enrollments.length}人）
          </>
        }
      >
        <Students data={course?.enrollments.map((e) => e.student)}></Students>
      </H2>
    </>
  )
}
