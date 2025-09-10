import {
  checkInvalidCourseIdsFromEnrollment,
  checkInvalidCourseIdsFromLesson
} from './checkIntegrity'
import { seedEntities } from './seedEntities'
import { seedRelations } from './seedRelations'

const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

async function retryWhenTimeout(fn: Function) {
  let exception: any

  const run = async () => {
    try {
      await fn()
    } catch (error) {
      exception = error
      console.error(error)
    }
  }

  await run()

  while (
    ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNABORTED'].includes(
      exception?.code
    )
  ) {
    console.log(`Retrying after ${exception?.code} ...`)
    exception = null
    await run()
  }


  while (["RATE_LIMIT"].includes(exception?.cause)) {
    console.log(`Retrying after ${exception?.cause} ,wait for 2 seconds...`)
    await sleep(2000)
    exception = null
    await run()
  }

}

retryWhenTimeout(async () => {
  console.log('Start seeding ...')
  await seedEntities()
  await seedRelations()
  await checkInvalidCourseIdsFromEnrollment()
  await checkInvalidCourseIdsFromLesson()
})
