import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'
import {
  checkInvalidCourseIdsFromLesson,
  checkInvalidCourseIdsFromEnrollment,
} from './checkIntegrity'

async function run() {
  let exception: any
  try {
    await seedEntities()
    await seedRelations()
    await checkInvalidCourseIdsFromEnrollment()
    await checkInvalidCourseIdsFromLesson()
  } catch (error) {
    console.error(error)
    exception = error
    return error
  } finally {
    while (exception?.code === 'ETIMEDOUT') {
      exception = await run()
    }
  }
}
run()
