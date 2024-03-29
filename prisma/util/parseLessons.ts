import prisma from '../../lib/prisma'
import { LessonRes } from '../api/getLessonsByID'
import {
  getLocationName,
  getTeacherIdbyjg0101id,
  locationNameAndIds,
} from './getFromMeta'

export type LessonData = Parameters<typeof prisma.lesson.create>[0]['data']

const weekIntervalMapping = {
  全部: 0,
  单周: 1,
  双周: 2,
}

export async function parseLesson(
  v: LessonRes
): Promise<LessonData & { teacherIds: string[] }> {
  const { 上课地点, 开课编号, 单双周, 开课时间, 上课周次, 授课教师 } = v
  const locationId = 上课地点?.split(',')?.[0]?.trim() || undefined
  const locationName = await getLocationName(locationId)

  await prisma.locationMeta.findFirst({
    where: {},
  })
  const trueLocationId = (await locationNameAndIds).find(
    (e) => e?.name?.trim() === locationName.trim()
  )?.id

  const weekFreq = weekIntervalMapping[单双周]

  const teacherIds = 授课教师
    ? await Promise.all(
        授课教师
          .split(',')
          .filter((e) => /^\w+$/.test(e))
          .map(getTeacherIdbyjg0101id)
      )
    : []
  const id = [开课编号, 开课时间, 上课周次].join('_')

  return {
    id,
    courseId: 开课编号,
    weeks: 上课周次,
    weekFreq,
    timeSlot: 开课时间,
    locationId: trueLocationId,
    teacherIds,
  }
}
