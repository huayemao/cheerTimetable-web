import { supplementSubjectAndSeedCourses } from './seedCoursesAndLessons'
import { seedCourses } from './seedCoursesAndLessons'
import { seedEnrollment } from './seedEnrollments'
import { login4query } from './api/login4query'

export async function seedRelations() {
  await login4query()
  await supplementSubjectAndSeedCourses()
  await seedCourses()
  await seedEnrollment()
}
