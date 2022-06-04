import { clearStorage } from './clear'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

import readline from 'readline'
import { getLastRecord } from './util/withPersisit'

import {
  checkInvalidCourseIdsFromLesson,
  checkInvalidCourseIdsFromEnrollment,
} from './checkIntegrity'

// todo: 询问是否强制更新
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

// rl.question('XXX? ', (answer) => {
//   console.log(`XXX: ${answer}`)
//   rl.close()
// })

async function run() {
  let lastRecord = await getLastRecord(false)
  await seedEntities(lastRecord)
  await seedRelations(lastRecord)
  await checkInvalidCourseIdsFromEnrollment()
  await checkInvalidCourseIdsFromLesson()
}

run()
