import { getNameById } from 'lib/api/getMeta'
import { Owner, OwnerType } from 'lib/types/Owner'

export function getTimeTableOwner(type: OwnerType, id: string): Owner {
  const typeMapping = {
    student: '学生',
    teacher: '教职工',
    location: '授课地点',
  }
  const label = typeMapping[type]
  const name = getNameById(type, id)
  return { label, name }
}
