import { H2 } from '@/components/H2'
import getCourseById from '@/lib/service/getCourseById'
import { parseCourseItemByLesson } from '@/lib/utils/parseCourseItemByLesson'
import { Students } from 'app/(search)/search/page'
import { CourseDetail } from 'components/Timetable/CourseDetail'
import MiniSchedule from 'components/Timetable/Mini'
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const course = await getCourseById(params.id)
  return {
    title: `${course?.subject.name}@${course?.term}`,
    abstract: `中南大学课程：${course?.subject.name}@${course?.term}`,
  }
}

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
      <H2 title={<>课程资料</>}>
        <div>上传</div>
      </H2>
    </>
  )
}
