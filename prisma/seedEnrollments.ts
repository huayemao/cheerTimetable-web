import { TERMS } from '../constants'
import prisma from '../lib/prisma'
import { getLessonsById } from './api/getLessonsByID'
import { getStudents2Fetch } from './util/getStudents2Fetch'
import { isUpdating } from './util/isUpdating'

const GAP = 5

export async function seedEnrollment(offset = 10, gap = GAP) {
  const terms = (await isUpdating('enrollment')) ? TERMS.slice(0, 1) : TERMS
  const students2Fetch = await getStudents2Fetch(terms)
  console.log('start seeding enrollment，total: ', students2Fetch.length)

  for (let i = offset; i < students2Fetch.length; i += gap) {
    const items = students2Fetch.slice(i, i + gap)
    const data = await Promise.all(
      items.map(async (e) => {
        const courseIds = await getCourseIdsByStudentId(e.xs0101id, terms)
        return courseIds.map((id) => ({
          studentId: e.xh,
          courseId: id,
        }))
      })
    )

    const studentIds = data.flat().map((e) => e.studentId)
    const [deletedPayload, payload] = await prisma.$transaction([
      prisma.enrollment.deleteMany({
        where: {
          studentId: {
            in: studentIds,
          },
          OR: terms.map((e) => ({
            courseId: {
              contains: e.split('-').join(''),
            },
          })),
        },
      }),
      prisma.enrollment.createMany({
        data: data.flat(),
        skipDuplicates: true,
      }),
    ])
    logProgress(
      students2Fetch.length,
      i,
      gap,
      'deleted ' + deletedPayload.count + ' updated ' + payload.count
    )
  }
}

const getCourseIdsByStudentId = async (studentId, terms = TERMS) => {
  const res = (
    await Promise.all(
      (terms as string[]).map(async (term) =>
        (
          await getLessonsById('student', studentId, term)
        ).map((e) => e.开课编号)
      )
    )
  ).flat()

  return Array.from(new Set(res))
}

function logProgress(
  total: number,
  i: number,
  gap: number,
  count: number | string
) {
  console.log(
    'total: ',
    total,
    ' offset ',
    i,
    '-',
    i + gap,
    ' ',
    count,
    ' records'
  )
}
