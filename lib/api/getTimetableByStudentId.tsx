import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'
import { chunk } from 'lodash'
import { getLessonByIds } from './getLessonByIds'

export async function getTimetableByStudentId(id: any) {
  const student = await prisma.student.findUnique({
    where: {
      id: id,
    },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  })

  const chunked = chunk(
    student?.enrollments.flatMap((e) => e.course.lessons.map((e) => e.id)),
    64
  )

  const lessons = (await Promise.all(chunked.map(getLessonByIds))).flat()

  const courses = lessons?.map(parseCourseItemByLesson)

  const owner: Owner = {
    name: student?.name,
    label: student?.className,
  }
  return { courses, owner }
}
