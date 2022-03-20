import _ from 'lodash'
import qs from 'qs'
import perseTable from '../parseTable'
import { OwnerType } from 'lib/types/Owner'
import fetchWithCookie, { retrieveCookie } from '../fetchWithCookie'
import prisma from 'lib/prisma'

const myHeaders = {
  Connection: 'keep-alive',
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  Origin: 'http://csujwc.its.csu.edu.cn',
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  Referer:
    'http://csujwc.its.csu.edu.cn/common/xs0101_select.jsp?id=xs0101id&name=xs0101xm&type=1&where=',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

const { map, mapKeys } = _

const mapping = {
  [OwnerType.student]: 'xs0101',
  [OwnerType.teacher]: 'jg0101',
  [OwnerType.location]: 'js',
}

export async function searchOwner(name, type) {
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
