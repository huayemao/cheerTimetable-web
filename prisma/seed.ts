import {
  checkInvalidCourseIdsFromEnrollment,
  checkInvalidCourseIdsFromLesson
} from './checkIntegrity'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

async function retryWhenTimeout(fn: Function) {
  let exception: any

  const run = async () => {
    try {
      await fn()
    } catch (error) {
      exception = error
    }
  }

  await run()

  while (
    ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNABORTED'].includes(
      exception?.code
    )
  ) {
    await run()
  }
}

retryWhenTimeout(async () => {
  await seedEntities()
  await seedRelations()
  await checkInvalidCourseIdsFromEnrollment()
  await checkInvalidCourseIdsFromLesson()
})
