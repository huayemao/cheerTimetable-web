import prisma from '../prisma'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'

export async function getTimetableByTeacherId(id: any) {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: id,
    },
    include: {
      tuitions: {
        include: {
          lesson: {
            include: {
              location: true,
              tuition: {
                include: {
                  teacher: true,
                },
              },
              course: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const courses = teacher?.tuitions?.flatMap((e) =>
    parseCourseItemByLesson(e.lesson)
  )

  const owner: Owner = {
    name: teacher?.name,
    label: (teacher?.facultyName || '') + teacher?.title,
  }

  return { courses, owner }
}
