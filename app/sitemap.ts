import prisma from '@/lib/prisma'
import { getDepartmentsAndProfessions } from '@/lib/service/profession'
import { APP_URL } from 'constants/siteConfig'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const date = new Date()

  const facultyAndProfessions = await getDepartmentsAndProfessions()
  const faculties = Object.keys(facultyAndProfessions)
  const professions = Object.values(facultyAndProfessions)
    .map((e) => e.map((e) => e.professionName))
    .flat()

  const facultyRecords = faculties.map((e) => {
    return {
      url: `${APP_URL}/departments/${e}`,
      lastModified: date,
    }
  })

  const professionRecords = professions.map((e) => {
    return {
      url: `${APP_URL}/schedule/profession/${e}`,
      lastModified: date,
    }
  })

  const teachers = await prisma.tuition.findMany({
    select: {
      teacherId: true,
    },
    distinct: 'teacherId',
    take: 2000,
  })
  const locations = await prisma.location.findMany({
    select: {
      id: true,
    },
    take: 600,
  })

  const courses = await prisma.course.findMany({
    select: {
      id: true,
    },
    where: {
      enrollments: {
        some: {
          studentId: {
            not: undefined,
          },
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
    take: 2000,
    distinct: 'id',
  })

  const teacherRecords = teachers.map((e) => {
    return {
      url: `${APP_URL}/schedule/teacher/${e.teacherId}`,
      lastModified: date,
    }
  })

  const coursesRecords = courses.map((e) => {
    return {
      url: `${APP_URL}/courses/${e.id}`,
      lastModified: date,
    }
  })

  const locationRecords = locations.map((e) => {
    return {
      url: `${APP_URL}/schedule/location/${e.id}`,
      lastModified: date,
    }
  })

  return [
    {
      url: APP_URL,
      lastModified: date,
    },
    ...facultyRecords,
    ...professionRecords,
    ...teacherRecords,
    ...coursesRecords,
    ...locationRecords,
  ]
}
