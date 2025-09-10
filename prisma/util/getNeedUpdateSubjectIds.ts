import { ASSUME_SEEDING_HOURS, COURSE_OFFSET, TERMS } from '../../constants'
import prisma from '../../lib/prisma'

export async function getNeedUpdateSubjectIds(terms) {
  const excludeCondition = {
    AND: {
      // 对非本次数据更新期间创建的 subject，如果本次数据更新期间已经动过，则跳过
      updatedAt: {
        gte: new Date(
          new Date().valueOf() - ASSUME_SEEDING_HOURS * 60 * 60 * 1000
        ),
      },
      createdAt: {
        lte: new Date(
          new Date().valueOf() - ASSUME_SEEDING_HOURS * 60 * 60 * 1000
        ),
      },
      // 这个设计的不好，暂时不用，JSON 很难去对比，应该做成varchar 的。
      // unopenTerms: {
      //   equals: terms,
      // },
    },
  }
  const allSubjectIds = (
    await prisma.subject.findMany({
      where: {
        tooOld: false,
        NOT: excludeCondition,
      },
      select: {
        id: true,
      },
    })
  ).map((e) => e.id)

  // 刚刚创建过 course 的 subject 过滤掉
  const skippedIds = (
    await prisma.course.findMany({
      select: {
        subjectId: true,
      },
      where: {
        OR: {
          createdAt: {
            gte: new Date(
              new Date().valueOf() - ASSUME_SEEDING_HOURS * 60 * 60 * 1000
            ),
          },
        },
      },
    })
  ).map((e) => e.subjectId)

  // 保证输入的数组长度尽可能短
  const idCondition =
    allSubjectIds.length > skippedIds.length * 2
      ? { notIn: skippedIds }
      : { in: allSubjectIds.filter((e) => !skippedIds.includes(e)) }

  const ids = (
    await prisma.subject.findMany({
      select: { id: true },
      where: {
        id: idCondition,
        tooOld: false,
        NOT: excludeCondition,
      },
    })
  ).map((e) => e.id)
  return ids
}