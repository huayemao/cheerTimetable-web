import { STUDENTS } from '../../_data/metas'
import prisma from '../../lib/prisma'
import { parseGrade } from '../../lib/term'

// 年级太高的，不应该再拉数据了，但是考虑到医学生。。。
const GRADE_NUM = 18

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
        gte: new Date(new Date().valueOf() - 48 * 60 * 60 * 1000),
      },
      // 认为拉取应该在2天内完成
    },
    distinct: ['studentId'],
  })
  // 在给定学期已经有 2 天内创建的 enrollment 的学生，会被跳过
  const existedIds = res.map((e) => e.studentId)

  const students2Fetch = (await STUDENTS).filter((e) => {
    const grade = parseGrade(e.xh)
    return grade && (grade as number) >= GRADE_NUM && !existedIds.includes(e.xh)
  })
  return students2Fetch
}
