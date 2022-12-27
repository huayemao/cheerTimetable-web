import { TERMS } from '../../constants'
import { STUDENTS } from '../../_data/metas'
import prisma from '../../lib/prisma'
import { parseGrade } from '../../lib/term'
import { isUpdating } from './isUpdating'

export async function getStudents2Fetch(terms) {
  const { existedStudentIds, START_GRADE_NUM } = await getExistedStudentIds(
    terms
  )

  const students2Fetch = (await STUDENTS).filter((e) => {
    if (existedStudentIds.includes(e.xh.trim())) {
      return false
    }

    // todo: 这个年级可能不应该这么取，而是应该从 prisma.student 里面查
    const grade = parseGrade(e.xh.trim())

    if (grade && (grade as number) < START_GRADE_NUM) {
      // 年级太早的不要，但这么做可能依旧不保险
      return false
    }

    return true
  })

  const sorted = students2Fetch.sort(
    (a, b) => (parseGrade(b.xh) || 0) - (parseGrade(a.xh) || 0)
  )

  return sorted
}

/* 
已经有数据的学生 id：
在给定学期已经有 3 天内创建的 enrollment 的学生
这些学生在 seedEnrollment 时应该被跳过
 */
async function getExistedStudentIds(terms: any) {
  // 本来年级太高的，不应该再拉数据了，但是考虑到医学生。。。 拉六年内的学生课表吧
  const START_GRADE_NUM =
    terms.length === 1 ? Number(TERMS[0].split('-')[0]) - 6 - 2000 : 14

  const OR = terms.map((e) => ({
    courseId: { contains: e.replaceAll('-', '') },
  }))

  const enrollments = await prisma.enrollment.findMany({
    select: {
      studentId: true,
    },
    where: {
      OR,
      createdAt: {
        gte: new Date(new Date().valueOf() - 72 * 60 * 60 * 1000),
      },
      // 认为拉取应该在 3 天内完成
    },
    distinct: ['studentId'],
  })
  const existedStudentIds = enrollments.map((e) => e.studentId)
  return { existedStudentIds, START_GRADE_NUM }
}
