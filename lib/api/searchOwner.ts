import _ from 'lodash'
import qs from 'qs'
import perseTable from '../parseTable'
import { OwnerType } from 'lib/types/Owner'
import prisma from 'lib/prisma'

const { map, mapKeys } = _

const mapping = {
  [OwnerType.student]: 'xs0101',
  [OwnerType.teacher]: 'jg0101',
  [OwnerType.location]: 'js',
}

export async function searchOwner(name) {
  const students = prisma.student.findMany({
    where: { name: { equals: name } },
    orderBy: { grade: 'desc' },
  })

  const teachers = Promise.all([
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
  ]).then((e) => e.flat())

  const locations = prisma.location.findMany({
    where: {
      name: { contains: name },
    },
    orderBy: {
      building: 'desc',
    },
  })

  return await Promise.all([students, teachers, locations])
}
