import { Course, CourseMeta, Subject, Tuition } from '@prisma/client'
import { COURSES } from '../_data/metas'
import prisma from '../lib/prisma'
import { getCourseStuffs } from './util/getCourseStuffs'
import { TERMS } from '../constants'
import { getSubjectMeta } from './util/getFromMeta'

export async function supplementSubjectAndSeedCourses() {
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
    },
  })

  const existedIds = subjects.map((e) => e.id)

  const courseMetas = (await COURSES).filter(
    (e) => !existedIds.includes(e.kch.trim())
  )

  const toSupplement: CourseMeta[] = []

  for (const c of courseMetas) {
    const id = existedIds.find((el) => el.trim().includes(c.kch.trim()))
    if (id) {
      const record = (await prisma.subject.findFirst({
        where: {
          id,
        },
      })) as Subject
      // 匹配到的修改 在 subject 表中增加记录
      await prisma.subject.create({
        data: {
          ...record,
          id: c.kch.trim(),
        },
      })
    } else {
      toSupplement.push(c)
    }
  }

  await seedSubjectByCourseMeta(toSupplement)
}

async function upsertSubject(data, subjectId: string) {
  await prisma.subject.upsert({
    create: data,
    update: data,
    where: {
      id: subjectId,
    },
  })
}

export async function seedSubjectByCourseMeta(courseMetas) {
  console.log('start supplementing Subject')
  for (let i = 0; i < courseMetas.length; i++) {
    const element = courseMetas[i]
    const subjectId = element.kch.trim()

    // todo：这里需要增加学期列表参数
    const { lessons, courses, subject, tuitions } =
      (await getCourseStuffs(subjectId, true)) || {}

    if (courses?.length && lessons?.length && tuitions?.length) {
      await upsertSubject(subject, subjectId)
      await updateSubjectDetail(
        subjectId,
        undefined,
        courses,
        lessons,
        tuitions
      )
      logProgress(subjectId, i, courseMetas.length)
    } else {
      const data = {
        id: subjectId,
        name: element?.kcmc as string,
        department: 'unknown',
        credit: 0,
        category: 'unknown',
        tooOld: true,
        tuitionHour: 0,
        tuitionHourDetail: '0-0-0-0-0',
      }
      await upsertSubject(data, subjectId)
      console.log('no data , skipped', i + 1, ' of total', courseMetas.length)
    }
  }
}

function logProgress(id: any, i: number, total: number) {
  console.log('completed ', id, ' ', i + 1, ' of total', total)
}

export async function seedCourses(offset = 0, terms = TERMS) {
  console.log('seed courses and lessons from subject, offset:', offset)
  const ids = await getIds2Fetch()

  const hasJx02Id = async (subjectId) => {
    const { jx02id, kcmc: name } = (await getSubjectMeta(subjectId)) || {}
    return jx02id
  }

  for (const id of ids) {
    if (!(await hasJx02Id(id))) {
      console.log(id, 'no jx02id')
      terms.length === TERMS.length &&
        (await prisma.subject.update({
          data: {
            tooOld: true,
          },
          where: {
            id: id,
          },
        }))
    }
  }

  for (let i = offset; i < ids.length; i++) {
    const id = ids[i]

    const { lessons, courses, tuitions } =
      (await getCourseStuffs(id, false, terms)) || {}

    if (courses?.length && lessons?.length && tuitions?.length) {
      await updateSubjectDetail(id, terms, courses, lessons, tuitions)
      logProgress(id, i, ids.length)
    } else {
      terms.length === TERMS.length &&
        (await prisma.subject.update({
          data: {
            tooOld: true,
          },
          where: {
            id: id,
          },
        }))
      console.log('no data , skipped', i + 1, ' of ', ids.length)
    }
  }
}

async function getIds2Fetch() {
  const allSubjectIds = (
    await prisma.subject.findMany({
      where: {
        tooOld: false,
      },
      select: {
        id: true,
      },
    })
  ).map((e) => e.id)
  const skippedIds = (
    await prisma.course.findMany({
      select: {
        subjectId: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().valueOf() - 24 * 60 * 60 * 1000),
        },
      },
    })
  ).map((e) => e.subjectId)

  const id = allSubjectIds.length > skippedIds.length * 2
    ? { notIn: skippedIds }
    : { in: allSubjectIds.filter((e) => !skippedIds.includes(e)) }

  const ids = (
    await prisma.subject.findMany({
      select: { id: true },
      where: {
        id,
        tooOld: {
          not: true,
        },
      },
    })
  ).map((e) => e.id)
  return ids
}

// 删除对应学期开课信息，重新添加
// todo: 其实 id 和 terms 这几个参数应该是不用要？还是要要，万一某个学期删除了开课，那么要删除这个学期的
async function updateSubjectDetail(
  id: string,
  terms: string[] | undefined,
  courses: Course[],
  lessons: any[],
  tuitions: Tuition[]
) {
  terms &&
    (await prisma.$transaction([
      prisma.course.deleteMany({
        where: {
          term: {
            in: terms,
          },
          subjectId: id,
        },
      }),
      prisma.course.createMany({
        data: courses as Course[],
        skipDuplicates: true,
      }),

      prisma.lesson.createMany({
        data: lessons,
        skipDuplicates: true,
      }),
      prisma.tuition.createMany({
        data: tuitions,
        skipDuplicates: true,
      }),
    ]))
}
