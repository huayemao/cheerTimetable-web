import { cache } from 'react'
import prisma from '../prisma'

export default cache(async function getCourseById(id: any) {
  return await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      subject: true,
      lessons: {
        include: {
          location: true,
          tuition: {
            include: {
              teacher: true,
            },
          },
          course: {
            include: {
              subject: true,
            },
          },
        },
      },
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  })
})
