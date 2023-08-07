import { Subject } from '@prisma/client'
import { LessonRes1 } from '../api/getLessons'
import { LessonRes } from '../api/getLessonsByID'
import { getInt } from './getCourseStuffs'

function getTuitionHourArr(v: LessonRes & { term: string }) {
  const { 讲课学时, 实践学时, 上机学时, 实验学时, 见习学时 } = v || {}
  const tuitionHourArr = [讲课学时, 实践学时, 上机学时, 实验学时, 见习学时]
  return tuitionHourArr
}

export function parseSubject(
  subjectId: any,
  name: any,
  items: (LessonRes & { term: string })[],
  itemsAlt: (LessonRes1 & { term: string })[],
  cats: string[]
) {
  const tuitionHourArr = getTuitionHourArr(items[0])

  const subject: Omit<Subject, 'unopenTerms' | 'createdAt' | 'updatedAt'> = {
    id: subjectId,
    name,
    department: itemsAlt[0]?.承担单位 || '-',
    credit: Number(itemsAlt[0]?.学分),
    tuitionHour: tuitionHourArr.reduce((acc, item) => acc + getInt(item), 0),
    tuitionHourDetail: tuitionHourArr.map(getInt).join('-'),
    category: cats.find((e) => !!e) || 'unknown',
    tooOld: false,
  }
  return subject
}
