import { parseTable } from './util/parseTable'
import qs from 'qs'
import fetch from 'node-fetch'
import { groupBy, map } from 'lodash'
import { Course, Lesson, Location, Subject, Enrollment } from '@prisma/client'
import { mapKeys, pick } from 'lodash'
import { COOKIE, TERMS } from '../constants'
import COURSES from '../_data/courses.json'
import { getLessonsById, LessonRes } from './api/getLessonsByID'

import STUDENTS from '../_data/students.json'
import prisma from '../lib/prisma'
import { parseGrade } from '../lib/term'

const GAP = 7

export async function seedEnrollment(offset = 0, gap = GAP) {
  const existedIds = await getExistedStudentIds()

  const needFetchIds = STUDENTS.filter(
    (e) =>
      !(existedIds as string[]).includes(e.xh) &&
      parseGrade(e.xh) &&
      (parseGrade(e.xh) as number) >= 14
  )

  for (let i = offset; i < needFetchIds.length; i += gap) {
    const items = needFetchIds.slice(i, i + gap)

    const data = await Promise.all(
      items.map(async (e) =>
        (
          await getCourseIdsByStudentId(e.xs0101id)
        ).map((id): Enrollment => ({ studentId: e.xh, courseId: id }))
      )
    )
    const payload = await prisma.enrollment.createMany({
      data: data.flat(),
      skipDuplicates: true,
    })
    console.log(
      [
        'total: ',
        needFetchIds.length,
        ' offset ',
        i,
        '-',
        i + gap,
        ' ',
        payload.count,
        ' records',
      ].join('')
    )
  }
}

export const getCourseIdsByStudentId = async (studentId) => {
  const res = (
    await Promise.all(
      (TERMS as string[]).map(async (term) =>
        (
          await getLessonsById('student', studentId, term)
        ).map((e) => e.开课编号)
      )
    )
  ).flat()

  return Array.from(new Set(res))
}

export async function checkInvalidCourseIdsFromEnrollment(locations, termStr) {
  const ids = await prisma.course.findMany({
    select: {
      id: true,
    },
    distinct: ['id'],
    where: {
      id: {
        startsWith: termStr,
      },
    },
  })

  console.log(ids.length)

  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: { notIn: ids.map((e) => e.id), startsWith: termStr },
    },
    distinct: ['courseId'],
  })

  console.log(enrollments.map((e) => [e.courseId, e.studentId]))
}

export async function checkInvalidStudentIdsFromEnrollment() {
  const existedIds = await getExistedStudentIds()

  const needDeleteIds = existedIds.filter(
    (e) => !parseGrade(e) || (parseGrade(e) as number) < 14
  )

  console.log(needDeleteIds.length)
  console.log(needDeleteIds)
  const res = await prisma.enrollment.deleteMany({
    where: {
      studentId: { in: needDeleteIds },
    },
  })
  console.log(res.count)
}

async function getExistedStudentIds() {
  const res =
    (await prisma.$queryRaw`SELECT DISTINCT studentId FROM Enrollment; `) as {
      studentId: string
    }[]
  const existedIds = res.map((e) => e.studentId)
  return existedIds
}
