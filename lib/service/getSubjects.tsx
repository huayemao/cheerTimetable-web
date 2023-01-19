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
  const where = {
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
  }

  const [list, count, arr] = await prisma.$transaction([
    prisma.subject.findMany({
      take: pageInfo.pageSize,
      skip: pageInfo.offset,
      orderBy: {
        name: 'asc',
      },
      where,
    }),
    prisma.subject.count({
      where,
    }),
    prisma.subject.findMany({
      select: {
        credit: true,
      },
      distinct: 'credit',
      where,
    }),
  ])
  return [list, count, arr.map((e) => e.credit)]
}
