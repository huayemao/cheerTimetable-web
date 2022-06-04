import { Enrollment, Lesson } from '@prisma/client'
import prisma from '../lib/prisma'

export async function checkInvalidCourseIdsFromLesson() {
  const lessons = await prisma.$queryRawUnsafe<Lesson[]>(
    `select * from Lesson where courseId in (select courseId from Lesson where courseId not in (select id from Course));`
  )
  console.log('不合法的课堂：', lessons)
}

export async function checkInvalidCourseIdsFromEnrollment() {
  try {
    const enrollments = await prisma.$queryRawUnsafe<Enrollment[]>(
      `SELECT distinct courseId from Enrollment where courseId not In ( Select distinct(id) from Course);`
    )

    console.log('不合法的开课：', enrollments)
  } catch (error) {
    console.log(error)
  }
}

// todo:提示是否删除
