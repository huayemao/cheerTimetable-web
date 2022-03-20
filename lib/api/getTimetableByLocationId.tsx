import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'

export async function getTimetableByLocationId(id: any) {
  const location = await prisma.location.findUnique({
    where: {
      id: id,
    },
    include: {
      lessons: {
        include: {
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
  })

  const courses: CourseItem[] = location?.lessons.map((e) => ({
    ...parseCourseItemByLesson(e),
    term: e.course.term,
  }))

  const owner: Owner = {
    name: location.name,
    label: location?.building,
  }
  return { courses, owner }
}
