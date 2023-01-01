import { getTimetableByLocationId } from 'lib/api/getTimetableByLocationId'
import { getTimetableByStudentId } from 'lib/api/getTimetableByStudentId'
import { mergeSameCourse } from 'lib/mergeSameCourse'
import { CourseItem } from 'lib/types/CourseItem'
import { OwnerType } from 'lib/types/Owner'
import { getTimetableByTeacherId } from './getTimetableByTeacherId'

export async function getTimetable(type = OwnerType.student, id: string) {
  const fnMapping = {
    [OwnerType.teacher]: getTimetableByTeacherId,
    [OwnerType.student]: getTimetableByStudentId,
    [OwnerType.location]: getTimetableByLocationId,
  }
  const { courses, owner } = await fnMapping[type](id)

  return {
    courses: mergeSameCourse(courses as CourseItem[]),
    owner,
  }
}
