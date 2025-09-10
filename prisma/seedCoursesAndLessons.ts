import { Course, Tuition } from '@prisma/client'
import { pull } from 'lodash'
import { ASSUME_SEEDING_HOURS, COURSE_OFFSET, TERMS } from '../constants'
import prisma from '../lib/prisma'
import { COURSES } from '../_data/metas'
import { getCourseStuffs } from './util/getCourseStuffs'
import { getSubjectMeta } from './util/getFromMeta'
import { isUpdating } from './util/isUpdating'
import { getNeedUpdateSubjectIds } from './util/getNeedUpdateSubjectIds'

const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

/* meta 中有而 subject 列表中没有的课程 */
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

  await seedSubjectByCourseMeta(courseMetas)
}

async function upsertSubject(data, subjectId: string) {
  await prisma.subject.upsert({
    create: data,
    update: { ...data, tooOld: false },
    where: {
      id: subjectId,
    },
  })
}

export async function seedSubjectByCourseMeta(courseMetas) {
  console.log('start supplementing Subject')
  for (let i = 0; i < courseMetas.length; i++) {
    await sleep(280)
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

export async function seedCourses(offset = COURSE_OFFSET) {
  const updating = await isUpdating('course')
  const terms = updating ? TERMS.slice(0, 1) : TERMS

  console.log('seed courses and lessons from subject')
  const ids = await getNeedUpdateSubjectIds(terms)

  const hasJx02Id = async (subjectId) => {
    const { jx02id, kcmc: name } = (await getSubjectMeta(subjectId)) || {}
    return jx02id
  }

  for (const id of ids) {
    if (!(await hasJx02Id(id))) {
      await makeFlag(id);
      pull(ids, id)
      console.log(id, 'no jx02id', ids.length)
    }
  }

  for (let i = offset; i < ids.length; i++) {
    const id = ids[i]
    await sleep(280)

    const { lessons, courses, tuitions } =
      (await getCourseStuffs(id, false, terms)) || {}

    const arr = [courses?.length, lessons?.length, tuitions?.length]
    if (arr.every((e) => !!e)) {
      //@ts-ignore
      updateSubjectDetail(id, terms, courses, lessons, tuitions)
        .then(() => {
          logProgress(id, i, ids.length)
        })
        .catch(console.warn)
    } else {
      await makeFlag(id)
        .then(() => {
          console.log(ids[i], ' no data , skipped', i + 1, ' of ', ids.length)
        })
        .catch(console.warn)
    }
  }

  async function makeFlag(id: string) {
    if (terms.length === TERMS.length) {
      try {
        await prisma.subject.delete({
          where: {
            id: id,
          },
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      await prisma.subject.update({
        data: {
          unopenTerms: terms,
        },
        where: {
          id: id,
        },
      })
    }
  }
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
      prisma.subject.update({
        data: {
          unopenTerms: [],
        },
        where: {
          id: id,
        },
      }),
    ]))
}
