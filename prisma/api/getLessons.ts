import fetch from 'node-fetch'
import qs from 'qs'
import { BaseURL, HEADERS } from '../util/header'
import { parseTable } from '../util/parseTable'

type params = {
  jsid?: string
  jx02id?: string
  week?: number
  term?: string
  day?: number
  slotEnd?: number
  slotStart?: number
}

export type LessonRes1 = {
  课程: string
  学分: string
  任课教师: string
  职称: string
  课堂名称: string
  上课班级名称: string
  选课人数: string
  合班人数: string
  班数: string
  上课群组名称: string
  教学班名称: string
  周次: string
  节次: string
  上课地点: string
  承担单位: string
}

const parseNumber = (number: number) => String(number).padStart(2, '0')

export async function getLessons({
  jx02id,
  week,
  term,
  day,
  slotEnd,
  slotStart,
  jsid,
}: params): Promise<LessonRes1[]> {
  const url = `${BaseURL}/tkglAction.do?method=qxzkb`

  const data = qs.stringify({
    jx02id: jx02id,
    zc: week,
    xq: day,
    xnxqh: term,
    jc: slotStart && parseNumber(slotStart as number),
    jc1: slotStart && parseNumber(slotEnd as number),
    type2: 2,
    pageSize: '2000',
    jsid,
  })

  const requestOptions = {
    method: 'POST',
    headers: HEADERS,
    body: data,
  }

  const res = await fetch(url, requestOptions)
  const html = await res.text()
  const list = parseTable<LessonRes1>(html)

  return list
}
