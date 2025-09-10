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
      console.error('Error:', error)
    }
  }

  await run()

  while (
    ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNABORTED'].includes(
      exception?.code
    )
  ) {
    console.log(`Retrying after ${exception.code} ...`)
    exception = null
    await run()
  }

  console.error(exception)
}

retryWhenTimeout(async () => {
  console.log('Start seeding ...')
  await seedEntities()
  await seedRelations()
  await checkInvalidCourseIdsFromEnrollment()
  await checkInvalidCourseIdsFromLesson()
})
