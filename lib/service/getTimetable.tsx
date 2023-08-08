import { mergeSameCourse } from '@/lib/utils/mergeSameCourse'
import { CourseItem } from 'lib/types/CourseItem'
import { OwnerType } from 'lib/types/Owner'
import { cache } from 'react'
import prisma from '../prisma'
import { getTimetableByLocationId } from './getTimetableByLocationId'
import { getTimetableByStudentId } from './getTimetableByStudentId'
import { getTimetableByTeacherId } from './getTimetableByTeacherId'

export const getTimetable = cache(
  async (
    type = OwnerType.student,
    id: string,
    term?: string,
    grade?: string
  ) => {
    // todo: 如果没有 term，寻找缺省的 term
    // 这一层抽成 service
    // getScheduleMeta
    // getSchedule
    // 看看next官方有没有新的关于目录结构的指南
    const fnMapping = {
      [OwnerType.teacher]: getTimetableByTeacherId,
      [OwnerType.student]: getTimetableByStudentId,
      [OwnerType.location]: getTimetableByLocationId,
      [OwnerType.profession]: async () => {
        const student = await prisma.student.findFirstOrThrow({
          where: {
            professionName: decodeURIComponent(id),
            grade,
          },
        })
        return {
          ...(await getTimetableByStudentId(student?.id)),
          owner: {
            name: decodeURIComponent(id),
            label: grade + '级',
          },
        }
      },
    }
    const { courses, owner, terms } = await fnMapping[type](id, term)

    return JSON.parse(
      JSON.stringify({
        courses: mergeSameCourse(courses as CourseItem[]),
        owner,
        terms:
          terms ||
          (Array.from(new Set(courses?.map((e) => e.term)))?.sort(
            (a: string, b: string) => b.localeCompare(a)
          ) as string[]),
      })
    )
  }
)
