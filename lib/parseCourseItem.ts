import { chunk, isFunction, mapKeys, mapValues, pick } from 'lodash'
import { CourseItem, TimetaleSlot } from './types/CourseItem'

export const parseSlot = (str: string): TimetaleSlot => {
  const day = parseInt(str[0], 10)
  const rest = str.slice(1)

  const seqs = chunk(rest, 2).map((e) => parseInt(e.join('')))
  const rowIds = seqs.reduce(
    (arr: number[], item, i) =>
      i % 2 === 0 ? arr.concat([Math.ceil(item / 2)]) : arr,
    []
  )
  // 只保留奇数节次，即开始节次
  return {
    day,
    rowIds,
  }
}
