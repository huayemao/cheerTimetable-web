import { TERMS } from '../constants'
import prisma from '../lib/prisma'
import { getStudents } from './api/getStudents'
import { isUpdating } from './util/isUpdating'

async function saveOnePageStudents(pageNum) {
  // todo: 这里还应该可以传年级
  return await getStudents(pageNum, '1000')
    .then(async (list) => {
      for (const data of list) {
        // 有的学生班级名可能变，为了更新班级名，一个个改吧
        await prisma.student.upsert({
          where: {
            id: data.id,
          },
          create: data,
          update: data,
        })
      }
      return {
        // 获取列表中最小的年级，一旦有例如 13 级的学生，就停止拉取
        grade: list.reduce(
          (maxGrade, item, i) => Math.min(parseInt(item.grade), maxGrade),
          2022 //这里初始值只需要大于 2013 就可以
        ),
      }
    })
    .then(({ grade }) => {
      console.log('page ' + pageNum + ' done')
      return {
        grade: grade,
      }
    })
}

export async function seedStudents() {
  let pageNum = 1
  let { grade } = await saveOnePageStudents(pageNum)
  // 导入最新一级学生，或是 14 级以来的学生
  const startGradeNum = (await isUpdating('student')) ? TERMS[0].split('-')[0] : 2014
  while (grade >= startGradeNum) {
    grade = (await saveOnePageStudents(++pageNum)).grade
  }
}
