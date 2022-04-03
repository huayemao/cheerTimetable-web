import prisma from '../prisma'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'
import { chunk } from 'lodash'
import { getLessonByIds } from './getLessonByIds'

export async function getTimetableByTeacherId(id: any) {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: id,
    },
    include: {
      tuitions: true,
    },
  })

  const chunked = chunk(
    teacher?.tuitions.map((e) => e.lessonId),
    64
  )

  const lessons = (await Promise.all(chunked.map(getLessonByIds))).flat()

  const courses = lessons?.map(parseCourseItemByLesson)

  const owner: Owner = {
    name: teacher?.name,
    label: (teacher?.facultyName || '') + teacher?.title,
  }

  return { courses, owner }
}

