import prisma from '../lib/prisma'

export async function clearStorage() {
  await prisma.seedStatus.deleteMany({})
  await prisma.enrollment.deleteMany({})
  await prisma.tuition.deleteMany({})
  await prisma.lesson.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.teacher.deleteMany({})
  await prisma.subject.deleteMany({})
  await prisma.location.deleteMany({})
  await prisma.student.deleteMany({})
}
