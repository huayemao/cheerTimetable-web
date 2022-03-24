import prisma from '../../lib/prisma'
import { SeedStatus } from '@prisma/client'

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
