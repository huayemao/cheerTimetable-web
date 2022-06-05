import { omit } from 'lodash'
import { Course, Lesson, Prisma, Subject, Tuition } from '@prisma/client'
import { COURSES } from '../_data/metas'
import prisma from '../lib/prisma'
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

  // 从 COURSEMETA 中筛选出需要增补的 subjectIds
  const courseMetas = (await COURSES).filter(
    (e) => !existedIds.includes(e.kch.trim())
  )
  await seedSubjectByCourseMeta(courseMetas, locations)
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

// todo：想办法去掉 locations 这个参数
export async function seedSubjectByCourseMeta(courseMetas, locations) {
  // 测试级联删除是否起作用
  // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete-1

  // select * from Course where subjectId = '010126Z1'; => 201620171004240
  //  select * from Lesson where courseId = '201620171004240';

  // await prisma.subject.update({
  //   where: {
  //     id: '010126Z1',
  //   },
  //   data: {
  //     courses: {
  //       deleteMany: {},
  //     },
  //   },
  // })

  console.log('增补 Subject')
  for (let i = 0; i < courseMetas.length; i++) {
    const element = courseMetas[i]
    const subjectId = element.kch.trim()

    // todo：这里需要增加学期列表参数
    const { lessons, courses, subject, tuitions } =
      (await getCourseStuffs(subjectId, true, locations)) || {}

    if (courses?.length && lessons?.length && tuitions?.length) {
      await upsertSubject(subject, subjectId)
      await insertSubjectDetail(courses, lessons, tuitions)
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

export async function seedCourses(offset = 0, locations) {
  console.log('由全部课程导入开课信息')
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

  // 筛选出所有没有开课信息的 Subjects todo: 改为 SQL?
  const ids = subjects.map((e) => e.id).filter((i) => !hasDataIds.includes(i))

  for (let i = offset; i < ids.length; i++) {
    const id = ids[i]

    const { lessons, courses, tuitions } =
      (await getCourseStuffs(id, false, locations)) || {}

    if (courses?.length && lessons?.length && tuitions?.length) {
      await insertSubjectDetail(courses, lessons, tuitions)

      // 是否需要改为嵌套添加，才能使完整性约束生效？

      // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes
      // Support any level of nesting supported by the data model.
      // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#add-new-related-records-to-an-existing-record
      // cannot access relations in a createMany query
      // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#set

      // await prisma.subject.update({
      //   where: {},
      //   data: {
      //     courses: {
      //       // 别忘了 filter
      //       create: courses.map(
      //         (c): Prisma.CourseCreateWithoutSubjectInput => ({
      //           ...c,
      //           lessons: {
      //             create: lessons.map(
      //               (l): Prisma.LessonCreateWithoutCourseInput => ({
      //                 ...l,
      //                 tuition: {
      //                   create: {},
      //                 },
      //               })
      //             ),
      //           },
      //         })
      //       ),
      //     },
      //   },
      //   // include 何时用
      // })

      logProgress(id, i, ids.length)
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

async function insertSubjectDetail(
  courses: Course[],
  lessons: any[],
  tuitions: Tuition[]
) {
  await prisma.$transaction([
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
  ])
}
