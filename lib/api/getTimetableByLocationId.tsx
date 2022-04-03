import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'
import { chunk } from 'lodash'
import { getLessonByIds } from './getLessonByIds'

export async function getTimetableByLocationId(id: any) {
  const location = await prisma.location.findUnique({
    where: {
      id: id,
    },
    include: {
      lessons: true,
    },
  })

  const chunked = chunk(
    location?.lessons.map((e) => e.id),
    64
  )
  const lessons = (await Promise.all(chunked.map(getLessonByIds))).flat()
  const courses = lessons?.map(parseCourseItemByLesson)

  const owner: Owner = {
    name: location?.name,
    label: location?.campus,
  }
  return { courses, owner }
}
