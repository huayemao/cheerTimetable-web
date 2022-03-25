import { CourseItem } from 'lib/types/CourseItem'

export const mergeSameCourse = (courseItem: CourseItem[]) =>
  courseItem.reduce((acc: CourseItem[], item: CourseItem) => {
    const matchedIndex = acc.findIndex(
      (e) =>
        e.courseId === item.courseId &&
        e.slot.day === item.slot.day &&
        e.slot.rowIds.join('') === item.slot.rowIds.join('')
    )
    if (matchedIndex != -1) {
      acc[matchedIndex].weeks += `,${item.weeks}`
      return acc
    } else {
      return acc.concat(item)
    }
  }, [])
