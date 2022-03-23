import { Course, Subject } from '@prisma/client'
import COURSES from '../_data/courses.json'
import STUDENTS from '../_data/students.json'
import { getLessonsById } from './api/getLessonsByID'
import { getLocationNameAndIds } from './api/getLocations'
import { supplementSubjectAndSeedCourses } from './seedCoursesAndLessons'
import { seedCourses } from './seedCoursesAndLessons'
import { seedEnrollment } from './seedEnrollments'
import { login4query } from './api/login4query'
import { TERMS } from '../constants'
import {
  checkInvalidCourseIdsFromLesson,
  checkInvalidCourseIdsFromEnrollment,
} from './checkIntegrity'

export async function seedRelations() {
  await login4query()
  const locations = await getLocationNameAndIds()
  await supplementSubjectAndSeedCourses(locations)
  await seedCourses(0, locations)
  await seedEnrollment(0, 9)

  for (const term of TERMS) {
    await checkInvalidCourseIdsFromEnrollment(locations, term)
    await checkInvalidCourseIdsFromLesson(locations, term)
  }
}
