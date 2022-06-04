import { STUDENTS } from '../../_data/metas'
import prisma from '../../lib/prisma'
import { parseGrade } from '../../lib/term'
import { GRADE_NUM } from '../seedEnrollments'

export async function getStudents2Fetch() {
  const existedIds = await getHasDataStudentIds()

  const students2Fetch = (await STUDENTS).filter(
    (e) =>
      !(existedIds as string[]).includes(e.xh) &&
      parseGrade(e.xh) &&
      (parseGrade(e.xh) as number) >= GRADE_NUM
  )
  return students2Fetch
}

async function getHasDataStudentIds() {
  const res =
    (await prisma.$queryRaw`SELECT DISTINCT studentId FROM Enrollment; `) as {
      studentId: string
    }[]
  const existedIds = res.map((e) => e.studentId)
  return existedIds
}
