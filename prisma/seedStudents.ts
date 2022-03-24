import prisma from '../lib/prisma'
import { getStudents } from './api/getStudents'

async function saveOnePageStudents(pageNum) {
  return await getStudents(pageNum, '1000')
    .then(async (list) => {
      return {
        payload: await prisma.student.createMany({
          data: list,
          skipDuplicates: true,
        }),
        grade: list.reduce(
          (maxGrade, item, i) => Math.min(parseInt(item.grade), maxGrade),
          2021
        ),
      }
    })
    .then(({ payload, grade }) => {
      console.log('page ' + pageNum + ' done with ' + payload.count + ' items')
      return {
        grade: grade,
      }
    })
}

export async function seedStudents() {
  let pageNum = 1
  let { grade } = await saveOnePageStudents(pageNum)
  while (grade > 2013) {
    grade = (await saveOnePageStudents(++pageNum)).grade
  }
}
