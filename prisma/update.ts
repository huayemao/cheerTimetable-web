import { clearStorage } from './clear'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

import readline from 'readline'

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
  await seedEntities()
  await seedRelations()
  await checkInvalidCourseIdsFromEnrollment()
  await checkInvalidCourseIdsFromLesson()
}

run()
