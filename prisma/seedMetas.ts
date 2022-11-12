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
  const count = await prisma.update.count({})
  const isUpdating = count > 1
  const seedStudentMeta = seedAllTerms(
    getStudentMeta,
    'StudentMeta',
    isUpdating
  )
  const seedLocationMeta = seedAllTerms(
    getLocationMeta,
    'LocationMeta',
    isUpdating
  )
  const seedCourseMeta = seedAllTerms(getCourseMeta, 'CourseMeta', isUpdating)
  const seedTeacherMeta = seedAllTerms(
    getTeacherMeta,
    'TeacherMeta',
    isUpdating
  )

  await seedStudentMeta()
  await seedLocationMeta()
  await seedCourseMeta()
  await seedTeacherMeta()

  function seedAllTerms(fn, tableName, isUpdating) {
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
