import { parseTable } from './util/parseTable'
import qs from 'qs'
import fetch from 'node-fetch'
import { map } from 'lodash'
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

export async function getExistedStudentIds() {
  const res =
    (await prisma.$queryRaw`SELECT DISTINCT studentId FROM Enrollment; `) as {
      studentId: string
    }[]
  const existedIds = res.map((e) => e.studentId)
  return existedIds
}
