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

  await seedMetas(lastRecord)

  await withPersisit(
    () => seedUtilNoData(getTeachers, prisma.teacher),
    'Teacher',
    lastRecord
  )()

  await withPersisit(
    () => {
      prisma.location.create({
        data: {
          id: '00default',
          name: '无',
        },
      })
      seedUtilNoData(getLocations, prisma.location)
    },
    'location',
    lastRecord
  )()
  await withPersisit(seedStudents, 'Student', lastRecord)()
  await withPersisit(seedSubjects, 'Subject', lastRecord)()
}
