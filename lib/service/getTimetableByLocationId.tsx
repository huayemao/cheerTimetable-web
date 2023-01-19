import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { chunk } from 'lodash'
import { getLessonByIds } from 'lib/utils/getLessonByIds'
import { parseCourseItemByLesson } from 'lib/utils/parseCourseItemByLesson'

export async function getTimetableByLocationId(id: any, term) {
  const [location, courses4Terms] = await prisma.$transaction([
    prisma.location.findUnique({
      where: {
        id: id,
      },
      include: {
        lessons: {
          where: {
            course: {
              term,
            },
          },
        },
      },
    }),
    prisma.course.findMany({
      distinct: ['term'],
      orderBy: {
        term: 'desc',
      },
      select: {
        term: true,
      },
      where: {
        lessons: {
          some: {
            locationId: id,
          },
        },
      },
    }),
  ])

  const chunked = chunk(
    location?.lessons.map((e) => e.id),
    64
  )

  const terms = courses4Terms.map((e) => e.term)

  const lessons = (await Promise.all(chunked.map(getLessonByIds)))
    .flat()
    .filter((lesson) => lesson.course.term === (term || terms[0]))
  const courses = lessons?.map(parseCourseItemByLesson)

  const owner: Owner = {
    name: location?.name,
    label: location?.campus,
  }
  return { courses, owner, terms }
}
