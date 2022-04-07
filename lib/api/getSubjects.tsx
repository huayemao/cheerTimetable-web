import prisma from 'lib/prisma'

export async function getSubjects(
  departmentName: string,
  pageInfo = {
    offset: 0,
    pageSize: 100,
  }
) {
  return await prisma.$transaction([
    prisma.subject.findMany({
      take: pageInfo.pageSize,
      skip: pageInfo.offset,
      orderBy: {
        name: 'asc',
      },
      where: {
        department: departmentName,
        courses: {
          some: {},
        },
      },
    }),
    prisma.subject.count({
      where: {
        department: departmentName,
        courses: {
          some: {},
        },
      },
    }),
  ])
}
