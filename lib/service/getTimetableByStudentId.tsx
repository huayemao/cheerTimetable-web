import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from 'lib/utils/parseCourseItemByLesson'
// import { chunk } from 'lodash'
// import { getLessonByIds } from './getLessonByIds'

// todo: 要不写一个抽象类吧。。。叫 ScheduleOwner

export async function getMeta(id: string) {
  const [courses, student] = await prisma.$transaction([
    prisma.course.findMany({
      distinct: ['term'],
      orderBy: {
        term: 'desc',
      },
      select: {
        term: true,
      },
      where: {
        enrollments: {
          some: {
            studentId: id,
          },
        },
      },
    }),
    prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        className: true,
      },
    }),
  ])

  const terms = courses.map((e) => e.term)
  const name = student?.name
  const label = student?.className
  const owner: Owner = {
    name,
    label,
  }
  return { terms, owner }
}

export async function getTimetableByStudentId(id: any, term?: string) {
  const [student, courses4Terms] = await prisma.$transaction([
    prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        enrollments: {
          where: {
            course: {
              // https://www.prisma.io/docs/concepts/components/prisma-client/null-and-undefined
              term: term,
            },
          },
          select: {
            course: {
              select: {
                lessons: {
                  include: {
                    location: {
                      select: {
                        id: true,
                        name: true,
                        building: true,
                      },
                    },
                    course: {
                      include: { subject: true },
                    },
                    tuition: {
                      include: {
                        teacher: {
                          select: {
                            name: true,
                            id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    // todo: terms 还是抽出去吧，不然每次都会刷。
    prisma.course.findMany({
      distinct: ['term'],
      orderBy: {
        term: 'desc',
      },
      select: {
        term: true,
      },
      where: {
        enrollments: {
          some: {
            studentId: id,
          },
        },
      },
    }),
  ])

  const terms = courses4Terms.map((e) => e.term)

  const lessons = student?.enrollments
    .flatMap((e) => e.course.lessons)
    .filter((lesson) => lesson.course.term === (term || terms[0]))

  const courses = lessons?.map(parseCourseItemByLesson)

  const owner: Owner = {
    name: student?.name,
    label: student?.className,
  }

  return { courses, owner, terms }
}
