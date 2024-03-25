import { ENROLLMENT_OFFSET, STUDENTS_PER_FETCH, TERMS } from '../constants'
import prisma from '../lib/prisma'
import { getLessonsById } from './api/getLessonsByID'
import { getStudents2Fetch } from './util/getStudents2Fetch'
import { isUpdating } from './util/isUpdating'
import fs from 'fs'

var emptyOffset = ENROLLMENT_OFFSET; // 初始化变量emptyOffset 用于空课表学生补偿计数
const constantName = 'ENROLLMENT_OFFSET'; // 定义要修改的常量名称 ENROLLMENT_OFFSET
console.log("ENROLLMENT_OFFSET Detected: " + emptyOffset)

/* 
offset -> 补偿用
emptyOffset -> 计数用
offset = emptyOffset * STUDENTS_PER_FETCH
*/
export async function seedEnrollment(offset = emptyOffset * STUDENTS_PER_FETCH, gap = STUDENTS_PER_FETCH) {
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

    if (deletedPayload.count == 0 && payload.count == 0) {
      // 遇到deleted 0 updated 0 时, emptyOffset++ 防止重复获取空课表的同学
      // 提示 第一次为0 所以每次fetch应该都会取一次空值 为正常 暂不修改 以便于查看请求情况
      const newValue = emptyOffset++;

      // 读取文件内容 存入./constants/seed.ts 作为常量
      fs.readFile('./constants/seed.ts', 'utf8', (err, data) => {
        if (err) {
          console.error('Reading enrollment offset error:', err);
          return;
        }
        // 在文件内容中查找要修改的常量 ENROLLMENT_OFFSET
        const regex = new RegExp(`export const ${constantName} = \\d+`);
        const updatedContent = data.replace(regex, `export const ${constantName} = ${newValue}`);
        // 写回修改后的内容到文件
        fs.writeFile('./constants/seed.ts', updatedContent, 'utf8', (err) => {
          if (err) {
            console.error('Setting enrollment offset error:', err);
            return;
          }
          console.log(`Empty detected: ${constantName} has already updated to ${newValue}`);
          console.log(`Offset = ${newValue*3}`);
        });
      });
    }

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
