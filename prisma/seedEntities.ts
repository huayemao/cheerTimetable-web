import { getLocations } from './api/getLocations'
import { getTeachers } from './api/getTeachers'
import { seedStudents } from './seedStudents'
import { seedSubjects } from './seedSubjects'
import { seedUtilNoData } from './util/seedUtilNoData'
import prisma from '../lib/prisma'
import { SeedStatus } from '@prisma/client'
import { clearStorage } from './clear'
import { login4query } from './api/login4query'

const withPersisit = (fn, tableName, lastRecord: SeedStatus) => {
  const dataAfter = {
    [tableName.toLowerCase()]: 1,
  }

  return async () => {
    const hasFinished = !!(
      (await prisma.seedStatus.findUnique({
        where: {
          id: lastRecord.id,
        },
      })) as SeedStatus
    )[tableName.toLowerCase()]

    if (!hasFinished) {
      console.log('start seeding ' + tableName)
      await fn()
      await prisma.seedStatus.update({
        data: dataAfter,
        where: { id: lastRecord.id },
      })

      console.log('finished seeding ' + tableName)
    } else {
      console.log('already finished, skip seeding ' + tableName)
    }
  }
}

export async function seedEntities() {
  await login4query()

  let lastRecord = await prisma.seedStatus.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  if (!lastRecord) {
    const res = await prisma.seedStatus.create({
      data: {
        student: 0,
        teacher: 0,
        subject: 0,
        course: 0,
        lesson: 0,
        enrollment: 0,
        tuition: 0,
        location: 0,
      },
    })
    lastRecord = res
  }

  await withPersisit(
    () => seedUtilNoData(getTeachers, prisma.teacher),
    'Teacher',
    lastRecord
  )()
  await withPersisit(
    () => seedUtilNoData(getLocations, prisma.location),
    'location',
    lastRecord
  )()
  await withPersisit(seedStudents, 'Student', lastRecord)()
  await withPersisit(seedSubjects, 'Subject', lastRecord)()
}
