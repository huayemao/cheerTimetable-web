import { Course, Lesson, PrismaClient, Subject, Tuition } from '@prisma/client'
import parseCourseItem from '../lib/parseCourseItem'
import {
  checkInvalidLocations,
  getLocationNameAndIds,
  getLocations,
} from './getLocations'
import { getStudents } from './getStudents'
import { getLessonsById, LessonRes } from './api/getLessonsByID'
import COURSES from '../_data/courses.json'
import STUDENTS from '../_data/students.json'
import LOCATIONS from '../_data/locations.json'
import {
  getCourseIdsByStudentId,
  seedEnrollment,
  checkInvalidCourseIdsFromEnrollment,
  checkInvalidStudentIdsFromEnrollment,
} from './seedEnrollment'
import { chunk, omit } from 'lodash'
import {
  getCourseStuffs,
  seedCourses,
  seedSubjectByIds,
  supplementSubjectAndSeedCources,
} from './getCoursesAndLessons'
import { getLessons, LessonRes1 } from './api/getLessons'
import { getTeachers } from './getTeachers'

export async function seedUtilNoData(getList, model) {
  async function saveOnePage(pageNum) {
    return await getList(pageNum, '1000').then(async (list) => {
      const payload = await model.createMany({
        data: list,
        skipDuplicates: true,
      })

      if (list.length) {
        console.log(list[0]?.id || list[0])
      }

      console.log('page ' + pageNum + ' done with ' + payload.count + ' items')

      return {
        payload,
        finished: list.length === 0,
      }
    })
  }

  let pageNum = 1
  let { finished } = await saveOnePage(pageNum)
  while (!finished) {
    finished = await (await saveOnePage(++pageNum)).finished
  }
}

export const prisma = new PrismaClient()

async function saveOnePageStudents(pageNum) {
  return await getStudents(pageNum, '1000')
    .then(async (list) => {
      console.log(list[0].name)
      return {
        payload: await prisma.student.createMany({ data: list }),
        grade: list.reduce(
          (maxGrade, item, i) => Math.min(parseInt(item.grade), maxGrade),
          2021
        ),
      }
    })
    .then(({ payload, grade }) => {
      console.log('page ' + pageNum + ' done with ' + payload.count + ' items')
      return {
        grade: grade,
      }
    })
}

async function seedStudents() {
  let pageNum = 71
  let { grade } = await saveOnePageStudents(pageNum)
  while (grade > 2013) {
    grade = (await saveOnePageStudents(++pageNum)).grade
  }
}

export async function seedLocations() {
  async function saveOnePage(pageNum) {
    return await getLocations(pageNum, '1000').then(async (list) => {
      const payload = await prisma.location.createMany({
        data: list,
      })
      if (list.length) {
        console.log(list[0].name)
      }

      console.log('page ' + pageNum + ' done with ' + payload.count + ' items')

      return {
        payload,
        finished: list.length === 0,
      }
    })
  }

  let pageNum = 1
  let { finished } = await saveOnePage(pageNum)
  while (!finished) {
    finished = await (await saveOnePage(++pageNum)).finished
  }
}

async function run() {
  // await seedUtilNoData(getTeachers, prisma.teacher)

  // const locations = await getLocationNameAndIds()
  // const res = await getCourseStuffs('180501T20', false, locations)
  // console.log(res)

  // await seedSubjects()

  // await seedSubjectByIds(['xxx'], locations)
  // await checkInvalidCourseIdsFromEnrollment(locations,'202120222')
  // await checkInvalidStudentIdsFromEnrollment()
  await seedEnrollment(0, 9)

  // await supplementSubjectAndSeedCources(locations)
  // await checkInvalidCourseIds(locations)

  // const res = await getCourseIdsByStudentId('8305180722')
  // console.log(res.length)
  // console.log(Array.from(new Set(res)).length)

  // await seedCourses(0, locations)

  // await checkInvalidCourseIds(locations)

  const subjects = await prisma.subject.findMany({
    where: {
      AND: {
        id: {
          in: COURSES.map((e) => e.kch),
        },
        courses: {
          none: {},
        },
        tooOld: false,
        // courses: {
        //   some: {
        //     lessons: {
        //       none: {},
        //     },
        //   },
        // },
        // courses: {
        //   some: {
        //     lessons: {
        //       every: {
        //         tuition: { none: {} },
        //       },
        //     },
        //   },
        // },
      },
    },
  })
  console.log(
    123,
    subjects.map((e) => e.id)
  )

  // 再验证一边异常的 record: tuition<1 的 lesson 和 lesson<2 的 course
}

run()

async function checkInvalidCourseIds(locations) {
  // const validIds = (
  //   await prisma.course.findMany({
  //     select: {
  //       id: true,
  //     },
  //   })
  // ).map((e) => e.id)

  const lessons: Lesson[] = await prisma.lesson.findMany({
    where: {
      course: {
        lessons: {
          none: {},
        },
      },
      // courseId: { notIn: validIds },
      // locationId: '00default',
    },
    distinct: ['courseId'],
  })

  console.log(
    345,
    lessons.map((e) => e.courseId)
  )

  const lessonsWithInvalidCourseId = lessons
  for (const e of lessonsWithInvalidCourseId) {
    const name = locations.find((l) => l.id === e.locationId).name
    const jsid = LOCATIONS.find((l) => l.jsmc === name)?.jsid
    const params = {
      jsid: jsid,
      day: Number(e.timeSlot.slice(0, 1)),
      term: [
        e.courseId.slice(0, 4),
        e.courseId.slice(4, 8),
        e.courseId.slice(8, 9),
      ].join('-'),
      slotStart: Number(e.timeSlot.slice(1, 3)),
      slotEnd: Number(e.timeSlot.slice(-2)),
    }
    const l: LessonRes1[] = await getLessons(params)

    console.log(e.id, l[0].课堂名称, l[0].课程)
  }
}

async function clearStorage() {
  await prisma.tuition.deleteMany({})
  await prisma.lesson.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.subject.deleteMany({})
}
