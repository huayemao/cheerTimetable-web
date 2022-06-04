import prisma from '../../lib/prisma'
import { SeedStatus } from '@prisma/client'

export async function getLastRecord(forceUpdate = false) {
  let lastRecord = await prisma.seedStatus.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  if (!lastRecord || forceUpdate) {
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

    !lastRecord &&
      (await prisma.location.create({
        data: {
          id: '00default',
          name: '无',
        },
      }))

    lastRecord = res
  }
  return lastRecord
}

export const withPersisit = (fn, tableName, lastRecord: SeedStatus) => {
  const fieldName = tableName.slice(0, 1).toLowerCase() + tableName.slice(1)
  const dataAfter = {
    [fieldName]: 1,
  }

  return async () => {
    const hasFinished = !!(
      (await prisma.seedStatus.findUnique({
        where: {
          id: lastRecord.id,
        },
      })) as SeedStatus
    )[fieldName]

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
