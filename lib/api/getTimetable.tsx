import { getTimetableByLocationId } from 'lib/api/getTimetableByLocationId'
import { getTimetableByStudentId } from 'lib/api/getTimetableByStudentId'
import { OwnerType } from 'lib/types/Owner'
import { getTimetableByTeacherId } from './getTimetableByTeacherId'

export async function getTimetable(type = OwnerType.student, id) {
  const fnMapping = {
    [OwnerType.teacher]: getTimetableByTeacherId,
    [OwnerType.student]: getTimetableByStudentId,
    [OwnerType.location]: getTimetableByLocationId,
  }

  return await fnMapping[type](id)
}
