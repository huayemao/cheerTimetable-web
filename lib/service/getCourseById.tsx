import prisma from '../prisma';

export async function getCourseById(id: any) {
  return await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      subject: true,
      lessons: {
        include: {
          location: true,
          tuition: {
            include: {
              teacher: true,
            },
          },
          course: {
            include: {
              subject: true,
            },
          },
        },
      },
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  });
}
