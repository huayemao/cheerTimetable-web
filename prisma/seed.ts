import { clearStorage } from './clear'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'
import {
  checkInvalidCourseIdsFromLesson,
  checkInvalidCourseIdsFromEnrollment,
} from './checkIntegrity'

import { getLastRecord } from './util/withPersisit'

async function run() {
  let lastRecord = await getLastRecord(false)
  // await clearStorage()
  await seedEntities(lastRecord)
  await seedRelations(lastRecord)
  await checkInvalidCourseIdsFromEnrollment()
  await checkInvalidCourseIdsFromLesson()
}

run()
