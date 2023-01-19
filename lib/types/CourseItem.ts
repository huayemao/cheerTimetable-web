export type TimetaleSlot = {
  day: number
  rowIds: number[]
}

export enum WeekInterval {
  'even' = '双周',
  'odd' = '单周',
  'none' = '全部',
}

export type CourseItem = {
  seq: string // 序号
  courseId: string //开课编号：202120221012243
  name: string
  location: { name: string; id: string; building: string }
  teachers: { name: string; id: string }[]
  studentCount: number
  classId: string
  slot: TimetaleSlot //在课表中的位置
  weeks: string
  weekInterval: WeekInterval
  term: string
  credit: number
  category: string
}
