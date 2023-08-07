import prisma from '../lib/prisma'
import { getSubjects } from './api/getSubjects'
import { seedUntilNoData } from './util/seedUtilNoData'

export async function seedSubjects() {
  const versions = Array.from(
    { length: new Date().getFullYear() - 2012 + 1 },
    (_, i) => 2012 + i
  )

  for (const version of versions) {
    await seedUntilNoData(async (...args) => {
      const [pageNum, pageSize] = args
      return await getSubjects(pageNum, pageSize, version)
    }, prisma.subject)()
  }
}
