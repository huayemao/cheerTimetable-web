import { STUDENTS } from '../../_data/metas'
import prisma from '../../lib/prisma'
import { parseGrade } from '../../lib/term'

const GRADE_NUM = 19

export async function getStudents2Fetch(terms) {
  const OR = terms.map((e) => ({
    courseId: { contains: e.replaceAll('-', '') },
  }))

  const res = await prisma.enrollment.findMany({
    select: {
      studentId: true,
    },
    where: {
      OR,
      createdAt: {
        gte: new Date(new Date().valueOf() - 24 * 60 * 60 * 1000),
      },
    },
    distinct: ['studentId'],
  })
  const existedIds = res.map((e) => e.studentId)

  const students2Fetch = (await STUDENTS).filter((e) => {
    const grade = parseGrade(e.xh)
    return grade && (grade as number) >= GRADE_NUM && !existedIds.includes(e.xh)
  })
  return students2Fetch
}
