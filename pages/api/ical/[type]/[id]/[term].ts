// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getNameById, searchByName } from 'lib/api/getMeta'
import { getTimeTable } from 'lib/api/getTimeTable'
import { parseLocation, parseTime, parseTeacher } from 'lib/parseCourseFields'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import ical, {
  ICalEvent,
  ICalEventRepeatingFreq,
  ICalRepeatingOptions,
} from 'ical-generator'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

const dateMapping = {
  '2021-2022-2': '2022-02-20',
  '2021-2022-1': '2021-08-29',
  '2020-2021-2': '2021-02-28',
  '2020-2021-1': '2020-09-06',
  '2019-2020-2': '2020-02-23',
  '2019-2020-1': '2019-08-25',
  '2018-2019-2': '2019-02-24',
  '2018-2019-1': '2018-09-03',
  '2017-2018-2': '2018-02-26',
  '2017-2018-1': '2017-09-04',
  '2016-2017-2': '2017-02-20',
  '2016-2017-1': '2016-08-28',
}

// 单数为开始时间，双数为结束时间
const timeMapping = {
  '1': '08-00',
  '2': '09-40',
  '3': '10-00',
  '4': '11-40',
  '5': '14-00',
  '6': '15-40',
  '7': '16-00',
  '8': '17-40',
  '9': '19-00',
  '10': '20-40',
  '11': '21-00',
  '12': '22-40',
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
  }
}

const buildEvent = (cal, term, course, week) => {
  if (week.includes(',')) {
    return week.split(',').map((w) => buildEvent(cal, term, course, w))
  }
  if (week.includes('-')) {
    const [startWeek, endWeek] = week.split('-')
    const actualStartWeek =
      course.单双周 === '全部'
        ? getFirstMatchedWeek(course.单双周, startWeek, endWeek)
        : startWeek
    return buildEventWithLoop(cal, term, course, actualStartWeek, endWeek, true)
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
  const repeating: ICalRepeatingOptions = {
    freq: ICalEventRepeatingFreq.WEEKLY,
    count: parseInt(endWeek) - parseInt(actualStartWeek) + 1,
    interval: hasGap ? 1 : 0,
  }

  const datetime = `${dateMapping[term]}-${timeMapping[String(course.start)]}`

  const termStartDay = dayjs(datetime, 'YYYY-MM-DD-HH-mm')

  const endDateTime = `${dateMapping[term]}-${timeMapping[String(course.end)]}`

  const termStartDayCourseEndTime = dayjs(endDateTime, 'YYYY-MM-DD-HH-mm')
  console.log(course.end)
  console.log(datetime)
  // console.log(endDateTime)

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
    },
    cal
  )
}

const getFirstMatchedWeek = (weekDescription, startWeek, endWeek) => {
  const mapping = {
    双周: 0,
    单周: 1,
  }
  return startWeek % 2 === mapping[weekDescription] ? startWeek : startWeek + 1
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

  calendar.serve(res)
}
