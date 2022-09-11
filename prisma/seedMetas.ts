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

export const seedMetas = async () => {
  const seedStudentMeta = seedAllTerms(getStudentMeta, 'StudentMeta')
  const seedLocationMeta = seedAllTerms(getLocationMeta, 'LocationMeta')
  const seedCourseMeta = seedAllTerms(getCourseMeta, 'CourseMeta')
  const seedTeacherMeta = seedAllTerms(getTeacherMeta, 'TeacherMeta')

  await seedStudentMeta()
  await seedLocationMeta()
  await seedCourseMeta()
  await seedTeacherMeta()

  function seedAllTerms(fn, tableName) {
    const isUpdating = false
    const terms = isUpdating ? TERMS.slice(0, 1) : TERMS
    const seedFn = async () => {
      for (let i = 0; i < terms.length; i++) {
        try {
          const data = await fn(terms[i])
          const chuncked = chunk(data, 5000)
          let count = 0

          for (const e of chuncked) {
            const res = await prisma[tableName].createMany({
              data: e,
              skipDuplicates: true,
            })
            count += res.count
          }
          console.log('term ', terms[i], 'inserted ', count, ' rows')
        } catch (error) {
          console.log(tableName + ' seed error')
          throw error
        }
      }
    }

    return withPersisit(seedFn, tableName)
  }
}
