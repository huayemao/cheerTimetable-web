import { login4query } from './api/login4query'
import { seedCourses, supplementSubjectAndSeedCourses } from './seedCoursesAndLessons'
import { seedEnrollment } from './seedEnrollments'

export async function seedRelations() {
  await login4query()
  await supplementSubjectAndSeedCourses()
  await seedCourses()
  await seedEnrollment()
}
