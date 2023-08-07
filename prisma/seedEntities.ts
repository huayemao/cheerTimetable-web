import prisma from '../lib/prisma'
import { getLocations } from './api/getLocations'
import { getTeachers } from './api/getTeachers'
import { login4query } from './api/login4query'
import { seedMetas } from './seedMetas'
import { seedStudents } from './seedStudents'
import { seedSubjects } from './seedSubjects'
import { seedUntilNoData } from './util/seedUtilNoData'
import { withPersist } from './util/withPersisit'

export async function seedEntities() {
  await login4query()

  await seedMetas()

  await withPersist(seedUntilNoData(getTeachers, prisma.teacher), 'Teacher')()

  await withPersist(
    seedUntilNoData(getLocations, prisma.location),
    'location'
  )()

  await withPersist(seedStudents, 'Student')()
  await withPersist(seedSubjects, 'Subject')()
}
