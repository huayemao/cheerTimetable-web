import prisma from 'lib/prisma'

export async function getSubjects(
  q,
  departmentName: string,
  pageInfo = {
    offset: 0,
    pageSize: 100,
  }
) {
  const [list, count, arr] = await prisma.$transaction([
    prisma.subject.findMany({
      take: pageInfo.pageSize,
      skip: pageInfo.offset,
      orderBy: {
        name: 'asc',
      },
      where: {
        department: departmentName,
        name: {
          contains: q || undefined,
        },
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
    prisma.subject.findMany({
      select: {
        credit: true,
      },
      distinct: 'credit',
      where: {
        department: departmentName,
        courses: {
          some: {},
        },
      },
    }),
  ])
  return [list, count, arr.map((e) => e.credit)]
}
