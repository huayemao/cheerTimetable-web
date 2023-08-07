import {
  checkInvalidCourseIdsFromEnrollment,
  checkInvalidCourseIdsFromLesson
} from './checkIntegrity'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

async function run() {
  let exception: any
  try {
    // await clearStorage()
    await seedEntities()
    await seedRelations()
    await checkInvalidCourseIdsFromEnrollment()
    await checkInvalidCourseIdsFromLesson()
  } catch (error) {
    console.error(error)
    exception = error
    return error
  } finally {
    while (['ETIMEDOUT', 'ECONNRESET'].includes(exception?.code)) {
      exception = await run()
    }
  }
}
run()
