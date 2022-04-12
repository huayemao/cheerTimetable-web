import prisma from 'lib/prisma'

export async function getSubjects(
  q,
  departmentName: string,
  pageInfo = {
    offset: 0,
    pageSize: 100,
  },
  publicElectiveOnly: string
) {
  const [list, count, arr] = await prisma.$transaction([
    prisma.subject.findMany({
      take: pageInfo.pageSize,
      skip: pageInfo.offset,
      orderBy: {
        name: 'asc',
      },
      where: {
        department: departmentName || undefined,
        name: {
          contains: q || undefined,
        },
        courses: {
          some: {},
        },
        id:
          (publicElectiveOnly === 'true' && {
            contains: '-',
          }) ||
          undefined,
      },
    }),
    prisma.subject.count({
      where: {
        department: departmentName || undefined,
        courses: {
          some: {},
        },
        id:
          (publicElectiveOnly === 'true' && {
            contains: '-',
          }) ||
          undefined,
      },
    }),
    prisma.subject.findMany({
      select: {
        credit: true,
      },
      distinct: 'credit',
      where: {
        department: departmentName || undefined,
        courses: {
          some: {},
        },
        id:
          (publicElectiveOnly === 'true' && {
            contains: '-',
          }) ||
          undefined,
      },
    }),
  ])
  return [list, count, arr.map((e) => e.credit)]
}
