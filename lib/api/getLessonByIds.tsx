import prisma from '../prisma'

export async function getLessonByIds(ids) {
  return await prisma.lesson.findMany({
    include: {
      location: {
        select: {
          id: true,
          name: true,
          building: true,
        },
      },
      course: {
        include: { subject: true },
      },
      tuition: {
        include: {
          teacher: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
    where: {
      id: { in: ids },
    },
  })
}
