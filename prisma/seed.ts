import { PrismaClient } from '@prisma/client'
import { getData } from './getData'

const prisma = new PrismaClient()

async function saveOnePage(pageNum) {
  return await getData(pageNum, '1000')
    .then(async (list) => {
      console.log(list[0].name)
      return {
        payload: await prisma.student.createMany({ data: list }),
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

async function run() {
  let pageNum = 71
  let { grade } = await saveOnePage(pageNum)
  while (grade > 2013) {
    grade = (await saveOnePage(++pageNum)).grade
  }
}

run()
