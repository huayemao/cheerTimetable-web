import { Enrollment, Lesson } from '@prisma/client'
import prisma from '../lib/prisma'
import { parseGrade } from '../lib/term'
import { LOCATIONS } from '../_data/metas'
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

  const lessons: Lesson[] = await prisma.lesson.findMany({
    where: {
      id: {
        startsWith: term.split('-').join(),
      },
      courseId: { notIn: validIds },
    },
    distinct: ['courseId'],
  })

  console.log(term, ' 学期不合法的开课编号：')
  console.log(lessons.map((e) => e.courseId))

  const lessonsWithInvalidCourseId = lessons
  for (const e of lessonsWithInvalidCourseId) {
    const name = locations.find((l) => l.id === e.locationId).name
    const jsid = (await LOCATIONS).find((l) => l.jsmc === name)?.jsid
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

  console.log(termStr, ' 学期开课总数：', ids.length)

  try {
    const enrollments = await prisma.$queryRawUnsafe<Enrollment[]>(
      `SELECT distinct * from Enrollment where courseId like '${termStr
        .split('-')
        .join('')}%' and courseId not In (${ids.map((e) => e.id).join(',')})`
    )

    console.log(
      termStr,
      ' 学期不合法的开课编号：',
      enrollments.map((e) => [e.courseId, e.studentId])
    )
  } catch (error) {
    console.log(error)
  }
}
