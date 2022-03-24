import prisma from '../lib/prisma'
import {
  getCourseMeta,
  getLocationMeta,
  getStudentMeta,
  getTeacherMeta,
} from './api/getMetas'
import { TERMS } from '../constants'
import { chunk } from 'lodash'
import { withPersisit } from './util/withPersisit'

export const seedMetas = async (lastRecord) => {
  const seedStudentMeta = seedAllTerms(getStudentMeta, 'StudentMeta')
  const seedLocationMeta = seedAllTerms(getLocationMeta, 'LocationMeta')
  const seedCourseMeta = seedAllTerms(getCourseMeta, 'CourseMeta')
  const seedTeacherMeta = seedAllTerms(getTeacherMeta, 'TeacherMeta')

  await seedStudentMeta()
  await seedLocationMeta()
  await seedCourseMeta()
  await seedTeacherMeta()

  function seedAllTerms(fn, tableName) {
    const seedFn = async () => {
      for (let i = 0; i < TERMS.length; i++) {
        try {
          const data = await fn(TERMS[i])
          const chuncked = chunk(data, 5000)

          for (const e of chuncked) {
            const res = await prisma[tableName].createMany({
              data: e,
              skipDuplicates: true,
            })
            console.log('inserted ', res.count, ' rows')
          }
        } catch (error) {
          console.log(tableName + ' seed error')
          throw error
        }
      }
    }

    return withPersisit(seedFn, tableName, lastRecord)
  }
}
