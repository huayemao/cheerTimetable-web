import { map } from 'lodash'
import prisma from '../lib/prisma'
import { Enrollment } from '@prisma/client'
import { mapKeys, pick } from 'lodash'
import { TERMS } from '../constants'
import { getLessonsById } from './api/getLessonsByID'
import { getStudents2Fetch } from './util/getStudents2Fetch'

const GAP = 7
export const GRADE_NUM = 14

export async function seedEnrollment(offset = 0, gap = GAP) {
  // todo：没有选课记录的学生记录下来，下次不再拉取
  const students2Fetch = await getStudents2Fetch()

  for (let i = offset; i < students2Fetch.length; i += gap) {
    const items = students2Fetch.slice(i, i + gap)

    const data = await Promise.all(
      items.map(async (e) => {
        const courseIds = await getCourseIdsByStudentId(e.xs0101id)
        return courseIds.map(
          (id): Enrollment => ({ studentId: e.xh, courseId: id })
        )
      })
    )

    const payload = await prisma.enrollment.createMany({
      data: data.flat(),
      skipDuplicates: true,
    })
    logProgress(students2Fetch.length, i, gap, payload.count)
  }
}

const getCourseIdsByStudentId = async (studentId) => {
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

function logProgress(total: number, i: number, gap: number, count: number) {
  console.log(
    'total: ',
    total,
    ' offset ',
    i,
    '-',
    i + gap,
    ' ',
    count,
    ' records'
  )
}
