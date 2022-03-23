import { Lesson } from '@prisma/client'
import prisma from '../lib/prisma'
import { parseGrade } from '../lib/term'
import LOCATIONS from '../_data/locations.json'
import { getLessons, LessonRes1 } from './api/getLessons'
import { getExistedStudentIds } from './seedEnrollments'

export async function checkInvalidCourseIdsFromLesson(locations, term) {
  const validIds = (
    await prisma.course.findMany({
      select: {
        id: true,
      },
      where: {
        term,
      },
    })
  ).map((e) => e.id)

  console.log(validIds.length)

  const lessons: Lesson[] = await prisma.lesson.findMany({
    where: {
      id: {
        startsWith: term.split('-').join(),
      },
      courseId: { notIn: validIds },
    },
    distinct: ['courseId'],
  })

  console.log(lessons.map((e) => e.courseId))

  const lessonsWithInvalidCourseId = lessons
  for (const e of lessonsWithInvalidCourseId) {
    const name = locations.find((l) => l.id === e.locationId).name
    const jsid = LOCATIONS.find((l) => l.jsmc === name)?.jsid
    const params = {
      jsid: jsid,
      day: Number(e.timeSlot.slice(0, 1)),
      term: [
        e.courseId.slice(0, 4),
        e.courseId.slice(4, 8),
        e.courseId.slice(8, 9),
      ].join('-'),
      slotStart: Number(e.timeSlot.slice(1, 3)),
      slotEnd: Number(e.timeSlot.slice(-2)),
    }
    const l: LessonRes1[] = await getLessons(params)

    console.log(e.id, l[0].课堂名称, l[0].课程)
  }
}

export async function checkInvalidCourseIdsFromEnrollment(locations, termStr) {
  const ids = await prisma.course.findMany({
    select: {
      id: true,
    },
    distinct: ['id'],
    where: {
      id: {
        startsWith: termStr.split('-').join(''),
      },
    },
  })

  console.log(ids.length)

  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: {
        notIn: ids.map((e) => e.id),
        startsWith: termStr.split('-').join(''),
      },
    },
    distinct: ['courseId'],
  })

  console.log(enrollments.map((e) => [e.courseId, e.studentId]))
}

