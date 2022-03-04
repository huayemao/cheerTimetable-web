// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'

import { getNameById, searchByName } from 'lib/api/getMeta'
import { getTimeTable } from 'lib/api/getTimeTable'
import { parseLocation, parseTime, parseTeacher } from 'lib/parseCourseFields'

import ical, {
  ICalEvent,
  ICalEventRepeatingFreq,
  ICalRepeatingOptions,
} from 'ical-generator'
import { DATE_TIME } from '../../../../../constants'

const { dateMapping, timeMapping } = DATE_TIME

dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)

const TIME_ZONE = 'Asia/Shanghai'
const getDate = (str) => {
  return dayjs.tz(str, 'YYYY-MM-DD-HH-mm', TIME_ZONE)
}

const transformData = (course) => {
  const { 开课时间, 授课教师, 上课地点, 上课周次, 单双周, 开课课程 } = course
  const { title: location } = parseLocation(上课地点)
  const teachers = parseTeacher(授课教师)
  const teacherStr = teachers.map((e) => e.title).join('、')
  const weekStr = 上课周次
  const { day, start, end } = parseTime(开课时间)
  return {
    description: `教师：${teacherStr}\n周次：${weekStr} ${单双周}`,
    summary: 开课课程,
    day,
    start,
    end,
    location,
    weekStr,
    单双周,
  }
}

const buildEvent = (cal, term, course, week) => {
  if (week.includes(',')) {
    return week.split(',').map((w) => buildEvent(cal, term, course, w))
  }
  if (week.includes('-')) {
    const [startWeek, endWeek] = week.split('-')
    const actualStartWeek =
      course.单双周 !== '全部'
        ? getFirstMatchedWeek(course.单双周, startWeek, endWeek)
        : startWeek
    return buildEventWithLoop(
      cal,
      term,
      course,
      actualStartWeek,
      endWeek,
      course.单双周 !== '全部'
    )
  } else {
    return buildEventWithLoop(cal, term, course, week, week, false)
  }
}

const buildEventWithLoop = (
  cal,
  term,
  course,
  actualStartWeek,
  endWeek,
  hasGap
) => {
  const literalCount = parseInt(endWeek) - parseInt(actualStartWeek) + 1
  const mapping = {
    双周: 0,
    单周: 1,
  }
  const count = hasGap
    ? Array.from(
        { length: literalCount },
        (e, i) => i + parseInt(actualStartWeek)
      ).filter((e) => e % 2 === mapping[course.单双周]).length
    : literalCount

  const repeating: ICalRepeatingOptions = {
    freq: ICalEventRepeatingFreq.WEEKLY,
    count,
    interval: hasGap ? 2 : 0,
  }

  const datetimeStr = `${dateMapping[term]}-${
    timeMapping[String(course.start)]
  }`

  const termStartDay = getDate(datetimeStr)

  const endDateTimeStr = `${dateMapping[term]}-${
    timeMapping[String(course.end)]
  }`

  const termStartDayCourseEndTime = getDate(endDateTimeStr)

  const start = termStartDay
    .add(actualStartWeek - 1, 'week')
    .add(course.day, 'day')

  const end = termStartDayCourseEndTime
    .add(actualStartWeek - 1, 'week')
    .add(course.day, 'day')

  return new ICalEvent(
    {
      start,
      end,
      summary: course.summary,
      description: course.description,
      location: course.location,
      repeating,
      timezone: 'Asia/Shanghai',
    },
    cal
  )
}

const getFirstMatchedWeek = (weekDescription, startWeek, endWeek) => {
  const mapping = {
    双周: 0,
    单周: 1,
  }
  const week =
    startWeek % 2 === mapping[weekDescription]
      ? startWeek
      : parseInt(startWeek, 10) + 1

  return week
}

// http://localhost:3000/api/ical/student/8305180722/2018-2019-2.ics

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, type } = req.query
  const virtualFilename = req.query.term as string
  const term = virtualFilename.replace('.ics', '')
  const { courses } = await getTimeTable(type, id, term)
  const title = getNameById(type, id)

  const calendar = ical({ name: title + ' ' + term + ' 学期的课表' })

  const events = courses
    .map(transformData)
    .flatMap((e) => buildEvent(calendar, term, e, e.weekStr))

  calendar.events(events)

  // console.log(calendar.toJSON())
  calendar.serve(res, `${term}.ics`)
}
