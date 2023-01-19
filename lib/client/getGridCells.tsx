import { CourseItem, WeekInterval } from 'lib/types/CourseItem'

export const getRowSpan = (courses: CourseItem[]) => {
  return !courses.length
    ? 1
    : courses.reduce(
        (maxSpan, item) => Math.max(maxSpan, item.slot.rowIds.length),
        0
      )
}

export function getWeekStr(course: CourseItem): string {
  const suffix =
    course.weekInterval === WeekInterval.none ? '周' : course.weekInterval
  const weekStr = course.weeks + ' ' + suffix
  return weekStr
}

export default function getGridCells(
  show7days: boolean,
  courses: CourseItem[],
  colCount: number
) {
  const emptyCells: any[] = Array.from(
    { length: show7days ? 42 : 30 },
    (e, i) => i + 1
  )

  const getCourses = (row: number, col: number) => {
    const filteredCourses = courses.filter((course) => {
      const {
        slot: { day, rowIds },
      } = course

      if (!show7days && day > 5) {
        return false
      }
      return day === col && rowIds[0] === row
    })

    return filteredCourses
  }

  emptyCells.forEach((num, i, arr) => {
    const row = Math.ceil(num / colCount)
    const modResult = num % colCount
    const col = modResult === 0 && num >= colCount ? colCount : modResult
    const courses = getCourses(row, col)
    const rowSpan = getRowSpan(courses)

    for (let n = 1; n <= getRowSpan(courses) - 1; n++) {
      arr[i + colCount * n] = {
        deleted: true,
      }
    }
    if (!arr[i].deleted)
      arr[i] = {
        courses,
        rowSpan,
      }
  })
  return emptyCells.filter((e) => !e.deleted)
}
