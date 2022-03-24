import { omit } from 'lodash'
import { Course, Lesson, Location, Subject, Tuition } from '@prisma/client'
import { COURSES } from '../_data/metas'
import prisma from '../lib/prisma'
import crypto from 'crypto'
import { getCourseStuffs } from './util/getCourseStuffs'

const mapping = {
  教室编号: 'id',
  教室类型: 'category',
  座位数: 'seatCount',
  有效座位: 'availableSeatCount',
  考试座位数: 'examSeatCount',
  所在校区: 'campus',
  所在教学楼: 'building',
  教室名称: 'name',
}

export async function supplementSubjectAndSeedCourses(locations) {
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
    },
  })

  const existedIds = subjects.map((e) => e.id)
  const ids = (await COURSES)
    .map((e) => e.kch)
    .filter((e) => !existedIds.includes(e))
  await seedSubjectByIds(ids, locations)
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

export async function seedSubjectByIds(ids, locations) {
  for (let i = 0; i < ids.length; i++) {
    const element = (await COURSES).find((e) => e.kch === ids[i])
    const subjectId = element?.kch?.trim()

    if (!subjectId) continue

    const { lessons, courses, subject, tuitions } =
      (await getCourseStuffs(subjectId, true, locations)) || {}

    if (courses?.length && lessons?.length) {
      const data = {
        ...(subject as Subject),
        courses: {
          createMany: {
            data: (courses as Course[]).map((e) => omit(e, 'subjectId')),
            skipDuplicates: true,
          },
        },
      }

      await upsertSubject(data, subjectId)
      try {
        await prisma.lesson.createMany({
          data: lessons,
          skipDuplicates: true,
        })
        await prisma.tuition.createMany({
          data: tuitions as Tuition[],
          skipDuplicates: true,
        })
        console.log(
          'completed ',
          subjectId,
          ' ',
          i + 1,
          ' of total',
          ids.length
        )
      } catch (error) {
        console.log(error)
        await prisma.student.delete({
          where: {
            id: subjectId,
          },
        })
        throw error
      }
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
      console.log('no data , skipped', i + 1, ' of total', ids.length)
    }
  }
}

export async function seedCourses(offset = 0, locations) {
  console.log('导入全部课程')
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
    },
    where: {
      tooOld: false,
    },
  })
  const hasDataIds = (
    await prisma.course.findMany({
      select: {
        subjectId: true,
      },
      distinct: ['subjectId'],
    })
  ).map((e) => e.subjectId)

  const ids = subjects.map((e) => e.id).filter((i) => !hasDataIds.includes(i))

  for (let i = offset; i < ids.length; i++) {
    const id = ids[i]

    const { lessons, courses, tuitions } =
      (await getCourseStuffs(id, false, locations)) || {}

    if (courses?.length && lessons?.length) {
      try {
        await prisma.course.createMany({
          data: courses as Course[],
          skipDuplicates: true,
        })

        await prisma.lesson.createMany({
          data: lessons,
          skipDuplicates: true,
        })
        await prisma.tuition.createMany({
          data: tuitions as Tuition[],
          skipDuplicates: true,
        })
        console.log('completed ', id, ' ', i + 1, ' of ', ids.length)
      } catch (error) {
        console.log(error)
        console.log('error--- with Subject ', id)
        throw error
      }
    } else {
      await prisma.subject.update({
        data: {
          tooOld: true,
        },
        where: {
          id: id,
        },
      })
      console.log('no data , skipped', i + 1, ' of ', ids.length)
    }
  }
}
