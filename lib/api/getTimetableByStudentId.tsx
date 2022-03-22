import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'

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
              lessons: {
                include: {
                  location: true,
                  course: {
                    include: { subject: true },
                  },
                  tuition: {
                    include: {
                      teacher: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  const courses = student?.enrollments?.flatMap((e) =>
    e.course.lessons.map((e) => parseCourseItemByLesson(e))
  )

  const owner: Owner = {
    name: student?.name,
    label: student?.className,
  }
  return { courses, owner }
}
