import { chunk, mapValues, mapKeys, isFunction, pick } from 'lodash'
import { CourseItem, TimetaleSlot, WeekInterval } from './types/CourseItem'

export const keyMapping = {
  序号: 'seq',
  上课班级: 'classId',
  排课人数: 'studentCount',
  开课编号: 'courseId',
  开课课程: 'name',
  授课教师: 'teacherIds',
  开课时间: 'slot',
  上课地点: 'locationId',
  上课周次: 'weeks',
  单双周: 'weekInterval',
}

const getTeacherIds = (str: string): string[] =>
  str.split(',').filter((e) => /\w+/.test(e))
//'803213,李跃辉' = > ['803213']

const getSlot = (str: string): TimetaleSlot => {
  const day = parseInt(str[0], 10)
  const rest = str.slice(1)

  const seqs = chunk(rest, 2).map((e) => parseInt(e.join('')))
  const rowIds = seqs.reduce(
    (arr, item, i) => (i % 2 === 0 ? arr.concat([Math.ceil(item / 2)]) : arr),
    []
  )
  // 只保留奇数节次，即开始节次
  return {
    day,
    rowIds,
  }
}

const getLocation = (str: string) => str.split(',')[0]
//'4080107,T107'=>'T107'

const getWeekInterval = (str: string): WeekInterval => {
  const mapping = {
    全部: 'none',
    单周: 'odd',
    双周: 'even',
  }
  return mapping[str]
}
//'4080107,T107'=>'T107'

export const valueMapper = {
  授课教师: getTeacherIds,
  开课时间: getSlot,
  上课地点: getLocation,
  单双周: getWeekInterval, //'全部',
}

export default function parseCourseItem(obj: Object): CourseItem {
  const item = mapValues(obj, (v, k) => {
    const mapper = valueMapper[k]
    return isFunction(mapper) ? mapper(v) : v
  })
  const keys = Object.keys(keyMapping)
  return mapKeys(pick(item, keys), (v, k) => keyMapping[k])
}
