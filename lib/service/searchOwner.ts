import _ from 'lodash'
import prisma from '../../lib/prisma'
import { getProfessionsByName } from './profession'

const { map, mapKeys } = _

export async function searchOwner(name: string) {
  const students = prisma.student.findMany({
    where: {
      OR: [{ name: { equals: name } }, { id: { equals: name } }],
    },
    orderBy: { grade: 'desc' },
  })

  const teachers = prisma
    .$transaction([
      prisma.teacher.findMany({
        where: {
          name: { equals: name },
        },
        orderBy: {
          facultyName: 'desc',
        },
      }),
      prisma.teacher.findMany({
        where: {
          name: {
            contains: name + '（',
          },
        },
        orderBy: {
          facultyName: 'desc',
        },
      }),
    ])
    .then((e) => e.flat())

  const locations = prisma.location.findMany({
    where: {
      name: { contains: name },
    },
    orderBy: {
      building: 'desc',
    },
  })

  // const professions = prisma.student.findMany({
  //   select: {
  //     professionName: true,
  //     facultyName: true,
  //   },
  //   where: {
  //     professionName: {
  //       contains: name,
  //     },
  //   },
  //   take: 100,
  //   distinct: 'professionName',
  // })

  // todo: transaction 里面可以套 transaction 吗
  return await Promise.all([
    students,
    teachers,
    locations,
    getProfessionsByName(name),
  ])
}
