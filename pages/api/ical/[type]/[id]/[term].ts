// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Teacher } from '@prisma/client'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import ical, {
  ICalEvent,
  ICalEventRepeatingFreq,
  ICalRepeatingOptions,
} from 'ical-generator'
import { getTimetable } from 'lib/api/getTimetable'
import { parseLocation, parseTime } from 'lib/parseCourseFields'
import { CourseItem, TimetaleSlot, WeekInterval } from 'lib/types/CourseItem'
import { OwnerType } from 'lib/types/Owner'
import type { NextApiRequest, NextApiResponse } from 'next'
import { DATE_TIME } from '../../../../../constants'

const { dateMapping, timeMapping } = DATE_TIME

dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)

const TIME_ZONE = 'Asia/Shanghai'
const getDate = (str) => {
  return dayjs.tz(str, 'YYYY-MM-DD-HH-mm', TIME_ZONE)
}

type CourseEventRaw = {
  description: string
  summary: string
  day: number
  start: number
  end: number
  location: string
  weeks: string
  weekInterval: WeekInterval
  term: string
}

const getSlotStartAndEnd = (slot: TimetaleSlot) => {
  const { day, rowIds } = slot
  const start = rowIds[0] * 2 - 1
  const end = rowIds[rowIds.length - 1] * 2
  return {
    start,
    end,
  }
}

const transformData = (course: CourseItem): CourseEventRaw => {
  const { slot, teachers, location, weeks, weekInterval, name, term } = course
  const teacherStr = getTeacherStr(teachers)
  const { start, end } = getSlotStartAndEnd(slot)

  return {
    description: `教师：${teacherStr}\n周次：${
      course.weeks + course.weekInterval
    } ${weekInterval}\n from 绮课`,
    summary: name,
    day: slot.day,
    start,
    end,
    location: location.name,
    weeks,
    weekInterval,
    term,
  }
}

const buildEvent = (cal, item: CourseEventRaw, week: string) => {
  if (week.includes(',')) {
    return week
      .split(',')
      .map((singleWeek) => buildEvent(cal, item, singleWeek))
  }
  if (week.includes('-')) {
    const [startWeek, endWeek] = week.split('-')
    const actualStartWeek =
      item.weekInterval !== WeekInterval.none
        ? getFirstMatchedWeek(item.weekInterval, startWeek)
        : Number(startWeek)
    return buildEventWithLoop(cal, item, actualStartWeek, parseInt(endWeek, 10))
  } else {
    return buildEventWithLoop(cal, item, Number(week), Number(week))
  }
}

const buildEventWithLoop = (
  cal,
  item: CourseEventRaw,
  actualStartWeek: number,
  endWeek: number
) => {
  const hasGap = item.weekInterval !== WeekInterval.none
  const literalCount = endWeek - actualStartWeek + 1
  const mapping = {
    [WeekInterval.even]: 0,
    [WeekInterval.odd]: 1,
  }
  const count = hasGap
    ? Array.from(
        { length: literalCount },
        (e, i) => i + actualStartWeek
      ).filter((e) => e % 2 === mapping[item.weekInterval]).length
    : literalCount

  const repeating: ICalRepeatingOptions = {
    freq: ICalEventRepeatingFreq.WEEKLY,
    count,
    interval: hasGap ? 2 : 0,
  }

  const datetimeStr = `${dateMapping[item.term]}-${
    timeMapping[String(item.start)]
  }`

  const termStartDay = getDate(datetimeStr)

  const endDateTimeStr = `${dateMapping[item.term]}-${
    timeMapping[String(item.end)]
  }`

  const offset = termStartDay.day()

  const termStartDayCourseEndTime = getDate(endDateTimeStr)

  const start = termStartDay
    .add(actualStartWeek - 1, 'week')
    .add(item.day - offset, 'day')

  const end = termStartDayCourseEndTime
    .add(actualStartWeek - 1, 'week')
    .add(item.day - offset, 'day')

  return new ICalEvent(
    {
      start,
      end,
      summary: item.summary,
      description: item.description,
      location: item.location,
      repeating,
      timezone: 'Asia/Shanghai',
    },
    cal
  )
}

const getFirstMatchedWeek = (weekDescription, startWeek: string): number => {
  const mapping = {
    [WeekInterval.even]: 0,
    [WeekInterval.odd]: 1,
  }
  const week =
    Number(startWeek) % 2 === mapping[weekDescription]
      ? parseInt(startWeek, 10)
      : parseInt(startWeek, 10) + 1

  return week
}

function getTeacherStr(teachers: Teacher[]) {
  return teachers.map((e) => e.name + e.title).join('、')
}

// http://localhost:3000/api/ical/student/8305180722/2018-2019-2.ics

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, type } = req.query
  const virtualFilename = req.query.term as string
  const term = virtualFilename.replace('.ics', '')

  const { courses, owner } = await getTimetable(type as OwnerType, id)

  const title = owner.name + ' ' + '的课表'

  const calendar = ical({ name: owner.name + ' ' + '的课表' })

  const events = courses
    ?.filter((e) => e.term === term)
    .map(transformData)
    .flatMap((e) => buildEvent(calendar, e, e.weeks))

  calendar.events(events as ICalEvent[])

  // console.log(calendar.toJSON())
  calendar.serve(res, `${term}.ics`)
}
