import prisma from '../../lib/prisma'

export async function isUpdating(tableName: string) {
  // todo: 不能这么简单地判断，还要具体到每个实体
  const count = await prisma.update.count({})
  const isUpdating = count > 1
  const lastItem = await prisma.update.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return lastItem?.detail?.[tableName] ? isUpdating : false
}
