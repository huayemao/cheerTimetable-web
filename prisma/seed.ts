import { Course, Lesson, PrismaClient, Subject, Tuition } from '@prisma/client'
import { chunk, omit } from 'lodash'
import COURSES from '../_data/courses.json'
import LOCATIONS from '../_data/locations.json'
import STUDENTS from '../_data/students.json'
import { getLessons, LessonRes1 } from './api/getLessons'
import { getLessonsById, LessonRes } from './api/getLessonsByID'
import { getLocationNameAndIds, getLocations } from './api/getLocations'
import { getTeachers } from './api/getTeachers'
import {
  seedCourses,
  seedSubjectByIds,
  supplementSubjectAndSeedCources,
} from './getCoursesAndLessons'
import {
  checkInvalidCourseIdsFromEnrollment,
  checkInvalidStudentIdsFromEnrollment,
  seedEnrollment,
} from './seedEnrollments'
import { seedStudents } from './seedStudents'
import { seedSubjects } from './seedSubjects'
import { seedUtilNoData } from './util/seedUtilNoData'

const prisma = new PrismaClient()

async function run() {
  // these code remains mess, needs test and refactor

  await seedUtilNoData(getTeachers, prisma.teacher)
  await seedUtilNoData(getLocations, prisma.location)
  await seedStudents()

  const locations = await getLocationNameAndIds()

  await seedSubjects()

  await seedEnrollment(0, 9)

  await supplementSubjectAndSeedCources(locations)

  await checkInvalidStudentIdsFromEnrollment()
  await checkInvalidCourseIdsFromEnrollment(locations, '201620171')
  await checkInvalidCourseIdsFromLesson(locations, '2016-2017-2')

  await seedCourses(0, locations)
}

run()

async function checkInvalidCourseIdsFromLesson(locations, term) {
  const validIds = (
    await prisma.course.findMany({
      select: {
        id: true,
      },
      where: {
        term,
      },
    })
  ).map((e) => e.id)

  console.log(validIds.length)

  const lessons: Lesson[] = await prisma.lesson.findMany({
    where: {
      id: {
        startsWith: term.split('-').join(),
      },
      courseId: { notIn: validIds },
    },
    distinct: ['courseId'],
  })

  console.log(lessons.map((e) => e.courseId))

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
