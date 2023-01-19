import prisma from 'lib/prisma'

export async function getCoursesBySubject(subjectId) {
  return (
    await prisma.subject.findMany({
      include: {
        courses: true,
      },
      where: {
        id: {
          equals: subjectId,
        },
      },
    })
  )
}
