import { useRouter } from 'next/router'
import MiniSchedule from 'components/Timetable/Mini'
import { parseCourseItemByLesson } from '@/lib/utils/parseCourseItemByLesson'
import { CourseDetail } from 'components/Timetable/CourseDetail'
import { SubjectPreview } from 'components/PreviewCards/SubjectPreview'
import LessonPreview from 'components/Timetable/Cell'
import getCourseById from '../../../lib/service/getCourseById'
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

  // todo: 这个其实应该是个课表视图（mini schedule）
  return (
    <>
      {!!courseItems[0] && (
        <H2 title={'开课信息'} slate>
          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:gap-6 md:px-8">
            <CourseDetail
              key={courseItems[0].courseId + courseItems[0].slot}
              className="max-w-[308px] rounded bg-white shadow md:max-w-[364px]"
              course={courseItems[0]}
            />
            <MiniSchedule show7days courses={courseItems} />
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
