import prisma from '../../lib/prisma'
import { Update } from '@prisma/client'

export async function getLastUpdateRecord(forceUpdate = false) {
  let lastRecord = await prisma.update.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const shouldCreateRecord =
    !lastRecord || lastRecord.status === 1 || forceUpdate

  !lastRecord &&
    (await prisma.location.create({
      data: {
        id: '00default',
        name: '无',
      },
    }))

  if (shouldCreateRecord) {
    return await prisma.update.create({
      data: { detail: {} },
    })
  }

  return lastRecord as Update
}

export const withPersisit = (fn: () => Promise<any>, tableName: string) => {
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
