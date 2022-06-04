import { Course, Subject } from '@prisma/client'
import { getLessonsById } from './api/getLessonsByID'
import { getLocationNameAndIds } from './api/getLocations'
import { supplementSubjectAndSeedCourses } from './seedCoursesAndLessons'
import { seedCourses } from './seedCoursesAndLessons'
import { seedEnrollment } from './seedEnrollments'
import { login4query } from './api/login4query'
import { TERMS } from '../constants'

// todo：数据增量更新
export async function seedRelations(lastRecord) {
  await login4query()
  const locations = await getLocationNameAndIds()

  await supplementSubjectAndSeedCourses(locations)
  await seedCourses(0, locations)
  await seedEnrollment(0, 9)
}
