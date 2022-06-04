import { getLocations } from './api/getLocations'
import { getTeachers } from './api/getTeachers'
import { seedStudents } from './seedStudents'
import { seedSubjects } from './seedSubjects'
import { seedUtilNoData } from './util/seedUtilNoData'
import prisma from '../lib/prisma'
import { login4query } from './api/login4query'
import { seedMetas } from './seedMetas'
import { getLastRecord, withPersisit } from './util/withPersisit'

export async function seedEntities(lastRecord) {
  await login4query()

  await seedMetas(lastRecord)

  await withPersisit(
    () => seedUtilNoData(getTeachers, prisma.teacher),
    'Teacher',
    lastRecord
  )()

  await withPersisit(
    () => {
      seedUtilNoData(getLocations, prisma.location)
    },
    'location',
    lastRecord
  )()

  await withPersisit(seedStudents, 'Student', lastRecord)()
  await withPersisit(seedSubjects, 'Subject', lastRecord)()
}
