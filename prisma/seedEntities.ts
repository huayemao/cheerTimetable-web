import { getLocations } from './api/getLocations'
import { getTeachers } from './api/getTeachers'
import { seedStudents } from './seedStudents'
import { seedSubjects } from './seedSubjects'
import { seedUtilNoData } from './util/seedUtilNoData'
import prisma from '../lib/prisma'
import { login4query } from './api/login4query'
import { seedMetas } from './seedMetas'
import { withPersisit } from './util/withPersisit'

export async function seedEntities() {
  await login4query()

  await seedMetas()

  await withPersisit(seedUtilNoData(getTeachers, prisma.teacher), 'Teacher')()

  await withPersisit(
    seedUtilNoData(getLocations, prisma.location),
    'location'
  )()

  await withPersisit(seedStudents, 'Student')()
  await withPersisit(seedSubjects, 'Subject')()
}
