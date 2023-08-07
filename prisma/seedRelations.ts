import { login4query } from './api/login4query'
import { seedEnrollment } from './seedEnrollments'
import { withPersist } from './util/withPersisit'

export async function seedRelations() {
  await login4query()
  await withPersist(seedEnrollment, 'Enrollment')()
}
