import prisma from '../prisma';

export async function getLessonByIds(ids) {
  return await prisma.lesson.findMany({
    include: {
      location: true,
      course: {
        include: { subject: true },
      },
      tuition: {
        include: {
          teacher: true,
        },
      },
    },
    where: {
      id: { in: ids },
    },
  });
}
