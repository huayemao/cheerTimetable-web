import prisma from '../prisma'
import { CourseItem } from 'lib/types/CourseItem'
import { Owner } from 'lib/types/Owner'
import { parseCourseItemByLesson } from './parseCourseItemByLesson'
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
  // todo: 找到默认学期，算了不找了，找一遍又是一个 rtt 。。。
  // 或者 在 layout 中去找？， 抽出 getMeta，看起来在这里面也可以复用，而且不会每次都多刷关于 terms 的请求
  // 或者写个 middleware，如果没有指定学期，就走这个 getMeta 去在 searchParams 中加上学期参数？还是在 getTimetable 里面实现？
  // 或者这个走异步请求？
  if (!term) {
    const r = await prisma.course.findFirst({
      select: {
        term: true,
      },
      orderBy: {
        term: 'desc',
      },
      where: {
        enrollments: {
          some: {
            studentId: id,
          },
        },
      },
    })
    term = r?.term
  }

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
  // 好像没必要非得这样？
  // const chunked = chunk(
  //   student?.enrollments.flatMap((e) => e.course.lessons.map((e) => e.id)),
  //   64
  // )
  // const lessons = (await Promise.all(chunked.map(getLessonByIds))).flat()
  const lessons = student?.enrollments.flatMap((e) => e.course.lessons)
  const courses = lessons?.map(parseCourseItemByLesson)
  const terms = courses4Terms.map((e) => e.term)

  const owner: Owner = {
    name: student?.name,
    label: student?.className,
  }
  return { courses, owner, terms }
}
