import prisma from '@/lib/prisma'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

export async function getDepartmentsAndProfessions() {
  const res = await prisma.student.findMany({
    select: {
      facultyName: true,
      professionName: true,
    },
    distinct: ['facultyName', 'professionName'],
  })

  const data = groupBy(res, 'facultyName')
  return data
}

export async function getProfessionsByDepartmentName(name: string) {
  const res: {
    facultyName: string
    professionName: string
    grade: string
    studentCount?: number
  }[] = await prisma.student.findMany({
    select: {
      facultyName: true,
      professionName: true,
      grade: true,
    },
    where: {
      facultyName: name.trim(),
    },
    distinct: ['professionName', 'grade'],
  })

  const countRes = await prisma.student.groupBy({
    by: ['professionName', 'grade'],
    _count: true,
    where: {
      facultyName: name.trim(),
    },
  })

  for (const item of countRes) {
    res.find(
      (e) => e.professionName === item.professionName && e.grade === item.grade
    )!.studentCount = item._count
  }
  return transformProfessions(res)
}

export async function getProfessionsByName(name: string) {
  const res: {
    facultyName: string
    professionName: string
    grade: string
    studentCount?: number
  }[] = await prisma.student.findMany({
    select: {
      facultyName: true,
      professionName: true,
      grade: true,
    },
    where: {
      professionName: { contains: name.trim() },
    },
    distinct: ['professionName', 'grade'],
  })

  const countRes = await prisma.student.groupBy({
    by: ['professionName', 'grade'],
    _count: true,
    where: {
      professionName: { contains: name.trim() },
    },
  })

  for (const item of countRes) {
    res.find(
      (e) => e.professionName === item.professionName && e.grade === item.grade
    )!.studentCount = item._count
  }

  return transformProfessions(res)
}


function transformProfessions(res: { facultyName: string; professionName: string; grade: string; studentCount?: number | undefined }[]) {
  const data = groupBy(res, 'professionName')
  const professions = map(data, (v, k) => {
    return {
      ...v[0],
      professionName: v[0].professionName,
      grades: v
        .map((e) => {
          return {
            grade: e.grade,
            studentCount: e.studentCount,
          }
        })
        .sort((a, b) => Number(b.grade) - Number(a.grade)),
    }
  })

  return professions
}

