import { Update } from '@prisma/client'
import { ASSUME_SEEDING_HOURS } from '../../constants'
import prisma from '../../lib/prisma'

export async function getLastUpdateRecord(forceUpdate = false) {
  const count = await prisma.update.count({})
  const locationCount = await prisma.location.count({})

  !locationCount &&
    (await prisma.location.create({
      data: {
        id: '00default',
        name: '无',
      },
    }))

  let lastRecord = await prisma.update.findFirst({
    where: {
      createdAt: {
        gte: new Date(new Date().valueOf() - ASSUME_SEEDING_HOURS * 60 * 60 * 1000),
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const shouldCreateRecord =
    !lastRecord || lastRecord.status === 1 || forceUpdate

  if (shouldCreateRecord) {
    return await prisma.update.create({
      data: { detail: {} },
    })
  }

  return lastRecord as Update
}

export const withPersist = (fn: () => Promise<any>, tableName: string) => {
  const fieldName = tableName.slice(0, 1).toLowerCase() + tableName.slice(1)

  return async () => {
    const lastRecord = await getLastUpdateRecord(false)
    const isFinished = (lastRecord?.detail as Object)[fieldName] === 1

    if (isFinished) {
      console.log(tableName, ' already finished')
      return
    }
    console.log('start seeding ' + tableName)
    await fn()
    const detail = Object.assign({}, lastRecord.detail, { [fieldName]: 1 })
    await prisma.update.update({
      data: { detail },
      where: { id: lastRecord.id },
    })
    console.log('finished seeding ' + tableName)
  }
}
