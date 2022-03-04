export type TimetaleSlot = {
  day: number
  rowIds: number[]
}

export enum WeekInterval {
  'even',
  'odd',
  'none',
}

export type CourseItem = {
  seq: string // 序号
  courseId: string //开课编号：202120221012243
  name: string
  locationId: string
  teacherIds: string[]
  studentCount: number
  classId: string
  slot: TimetaleSlot //在课表中的位置
  weeks: string
  weekInterval: WeekInterval
}
