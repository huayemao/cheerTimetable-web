import { parseHTML } from './util/parseTable'
import qs from 'qs'
import fetch from 'node-fetch'
import { groupBy, map, mapKeys, pick, compact, omit, isArray } from 'lodash'
import { Course, Lesson, Location, Subject, Tuition } from '@prisma/client'
import { COOKIE, TERMS } from '../constants'
import COURSES from '../_data/courses.json'
import TEACHERS from '../_data/teachers.json'
import LOCATIONS from '../_data/locations.json'
import { getLessonsById, LessonRes } from './api/getLessonsByID'
import { LessonRes1 } from './api/getLessons'
import prisma from '../lib/prisma'
import { HEADERS } from './util/header'
import crypto from 'crypto'
import { off } from 'process'
import { getLessons } from './api/getLessons'

const mapping = {
  教室编号: 'id',
  教室类型: 'category',
  座位数: 'seatCount',
  有效座位: 'availableSeatCount',
  考试座位数: 'examSeatCount',
  所在校区: 'campus',
  所在教学楼: 'building',
  教室名称: 'name',
}

const getLocationName = (id) =>
  LOCATIONS.find((t) => t.jsid === id)?.jsmc || 'unknown'

const getSubjectCategory = async (jx02id, term) => {
  const url = 'http://csujwc.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_kb.jsp'

  const data = qs.stringify({
    xnxq01id: term,
    jx02id,
    type2: 'jx02',
    pageSize: '2000',
  })

  const requestOptions = {
    method: 'POST',
    headers: HEADERS,
    body: data,
  }

  const res = await fetch(url, requestOptions)
  const html = await res.text()
  const doc = parseHTML(html)

  return doc.querySelector('font[title=课程类别]')?.textContent.trim()
}

// 恭喜你得到了一坨屎山
export async function getCourseStuffs(
  subjectId,
  needSubjectCat = false,
  locations
): Promise<{
  courses: Course[]
  lessons: any[]
  subject: any
  tuitions: Tuition[]
} | null> {
  const { jx02id, kcmc: name } =
    COURSES.find((e) => e.kch?.trim() === subjectId.trim()) || {}
  if (!jx02id) {
    console.log('没有 jx02id, ', subjectId)
    return null
  }

  const mapByTerm = async (fn) =>
    (
      await Promise.all(
        (TERMS as string[]).map(async (term) => {
          const res = await fn(term)
          return isArray(res) ? res.map((e) => ({ ...e, term })) : res
        })
      )
    ).flat()

  const [items, itemsAlt, cat = []] = await Promise.all([
    mapByTerm((term) => getLessonsById('course', jx02id, term)),
    mapByTerm((term) => getLessons({ term, jx02id })),
    (needSubjectCat && mapByTerm((term) => getSubjectCategory(jx02id, term))) ||
      undefined,
  ])

  if (!items.length) {
    return null
  }

  const sample1: LessonRes & { term: string } = items[0]
  const sample2 = itemsAlt[0]

  const candidateKey = sample1.上课班级
  const canUseClassIdasKey =
    !!candidateKey.trim() &&
    /^\w+$/.test(candidateKey) &&
    !candidateKey.includes('-')

  const record = groupBy(compact(items), (e) => e.开课编号 + e.上课班级) // 上课班级可能会显示不全甚至没有，不用它来分组

  const others = groupBy(
    compact(itemsAlt),
    (e) => e.term + '_' + e.课堂名称 + e.教学班名称 + e.上课班级名称
  ) //课堂名称相同，教学班名称可能不同

  // console.log(others)
  // console.log(Object.keys(others))

  const { 讲课学时, 实践学时, 上机学时, 实验学时, 见习学时 } = sample1 || {}
  const tuitionHourArr = [讲课学时, 实践学时, 上机学时, 实验学时, 见习学时]
  const getInt = (str: string | undefined) => parseInt(str?.trim() || '0')

  const subject = {
    id: subjectId,
    name,
    department: sample2.承担单位,
    credit: parseInt(sample2.学分, 10),
    tuitionHour: tuitionHourArr.reduce((acc, item) => acc + getInt(item), 0),
    tuitionHourDetail: tuitionHourArr.map(getInt).join('-'),
    category: cat.find((e) => !!e),
  }

  const courses = map(
    others,
    (v: (LessonRes1 & { term: string })[], k): Course => {
      let id: string = getCourseId(v, k)

      const classNameFullValue = v[0].教学班名称.trim()

      return {
        id,
        subjectId,
        term: v[0].term,
        className:
          classNameFullValue && classNameFullValue.length > 60
            ? classNameFullValue.slice(0, 61) + '...'
            : classNameFullValue,
        electCount: getInt(v[0].选课人数),
        mergeCount: getInt(v[0].合班人数),
        // 干掉排课人数，以避免需要交叉查询字段
      }
    }
  )
  // console.log(courses.map((e) => e.id))
  const weekIntervalMapping = {
    全部: 0,
    单周: 1,
    双周: 2,
  }

  const getteacherIdbyjg0101id = (id) =>
    TEACHERS.find((t) => t.jg0101id === id)?.jgxm.match(/\[(.+)\]/)?.[1] ||
    'unknown'

  const lessons = map(record, (v: LessonRes[], k): any[] =>
    v.map(({ 上课地点, 开课编号, 单双周, 开课时间, 上课周次, 授课教师 }) => {
      const locationId = 上课地点?.split(',')?.[0]?.trim() || undefined
      const locationName = getLocationName(locationId)

      const trueLocationId = locations.find(
        (e) => e?.name?.trim() === locationName.trim()
      )?.id

      const weekFreq = weekIntervalMapping[单双周]

      const teacherIds = 授课教师
        ? 授课教师
            .split(',')
            .filter((e) => /^\w+$/.test(e))
            .map(getteacherIdbyjg0101id)
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
    })
  ).flat()

  const tuitions = lessons.flatMap((l) =>
    l.teacherIds.map(
      (id): Tuition => ({
        lessonId: l.id,
        teacherId: id,
      })
    )
  )

  return {
    courses,
    lessons: lessons.map((e) => omit(e, 'teacherIds')),
    subject,
    tuitions,
  }

  function getCourseId(v: (LessonRes1 & { term: string })[], k) {
    const sample = v[0]
    const candidateId = sample.课堂名称?.trim()

    let id
    if (candidateId && /^\w+$/.test(candidateId)) {
      // 上课班级是数字也不一定是开课编号
      const composited = sample.term.split('-').join('') + candidateId

      if (
        items.find((e) => e.开课编号 === composited) &&
        items.filter((e) => e.开课编号 === composited).length ===
          items.filter((e) => e.上课班级 === candidateId).length
      ) {
        id = composited
      } else {
        getId()
      }
    } else {
      getId()
    }

    return id

    function getId() {
      const reflectItems = items.filter((e) => {
        const value = e.上课班级.trim()
        const t1 = e.授课教师
          ?.trim()
          ?.match(/[\u4e00-\u9fa5]+/g)
          ?.sort()
          .join(',')

        const t2 = sample.任课教师
          ?.trim()
          ?.match(/[\u4e00-\u9fa5]+/g)
          ?.sort()
          .join(',')

        const matching1 =
          value &&
          value === candidateId &&
          e.term === sample.term &&
          items.filter(
            (e1) => e1.term === e.term && e1.上课班级.trim() === value
          ).length < 3 // 3个上课班级相同，认为不可信 // 有可能名字太长，有一个有截断
        const matching2 =
          value &&
          value.slice(0, 15) === candidateId.slice(0, 15) &&
          e.term === sample.term &&
          e.开课时间 === sample.节次 &&
          e.上课周次 === sample.周次.split('/')[0] &&
          (t1 && t2 ? t1 === t2 || t1.includes(t2) : true) &&
          (e.上课地点?.trim() && sample.上课地点.trim()
            ? e.上课地点?.split(',')?.[1]?.trim() === sample.上课地点.trim()
            : true)

        return matching1 || matching2
      })

      if (reflectItems.length > 0) {
        id = reflectItems[0].开课编号

        if (reflectItems.length > 1) {
          const best =
            reflectItems.find(
              (e) => sample.课堂名称.split('-')[1] === e.开课编号.slice(9)
            ) || reflectItems[0]

          id = best.开课编号
        }
      } else {
        id = items.find((e: LessonRes & { term: string }) => {
          const t1 = e.授课教师
            ?.trim()
            ?.match(/[\u4e00-\u9fa5]+/g)
            ?.sort()
            .join(',')

          const t2 = sample.任课教师
            ?.trim()
            ?.match(/[\u4e00-\u9fa5]+/g)
            ?.sort()
            .join(',')

          return (
            (e.term === sample.term &&
              e.开课时间 === sample.节次 &&
              e.上课周次 === sample.周次.split('/')[0] &&
              t1 === t2) ||
            (t1 &&
            t2 &&
            t1?.includes(t2 as string) &&
            e.上课地点?.trim() &&
            sample.上课地点.trim()
              ? e.上课地点?.split(',')?.[1]?.trim() === sample.上课地点.trim()
              : true)
          )
        })?.开课编号
      }
    }
  }
}

export async function supplementSubjectAndSeedCources(locations) {
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
    },
  })

  const ids = subjects.map((e) => e.id)

  for (let i = 0; i < COURSES.length; i++) {
    const element = COURSES[i]

    const subjectId = element.kch.trim()

    if (ids.includes(subjectId)) {
      continue
    }
    const { lessons, courses, subject, tuitions } =
      (await getCourseStuffs(subjectId, true, locations)) || {}

    if (courses?.length && lessons?.length) {
      await prisma.subject.create({
        data: {
          ...(subject as Subject),
          courses: {
            createMany: {
              data: (courses as Course[]).map((e) => omit(e, 'subjectId')),
              // skipDuplicates:true
            },
          },
        },
      })
      try {
        await prisma.lesson.createMany({
          data: lessons,
          skipDuplicates: true,
        })
        await prisma.tuition.createMany({
          data: tuitions as Tuition[],
          skipDuplicates: true,
        })
        console.log('completed ', subjectId, ' ', i + 1, ' of ', COURSES.length)
      } catch (error) {
        await prisma.student.delete({
          where: {
            id: subjectId,
          },
        })
        throw error
      }
    } else {
      await prisma.subject.create({
        data: {
          id: subjectId,
          name: element.kcmc,
          department: 'unknown',
          credit: 0,
          category: 'unknown',
          tooOld: true,
          tuitionHour: 0,
          tuitionHourDetail: '0-0-0-0-0',
        },
      })
      console.log('no data , skipped', i + 1, ' of ', COURSES.length)
    }
  }
}

export async function seedSubjectByIds(ids, locations) {
  for (let i = 0; i < ids.length; i++) {
    const element = COURSES.find((e) => e.kch === ids[i])
    const subjectId = element?.kch?.trim()
    console.log({ subjectId })

    if (!subjectId) continue

    const { lessons, courses, subject, tuitions } =
      (await getCourseStuffs(subjectId, true, locations)) || {}

    if (courses?.length && lessons?.length) {
      // console.log(courses?.map((e) => e.id))

      const items = {
        ...(subject as Subject),
        courses: {
          createMany: {
            data: (courses as Course[]).map((e) => omit(e, 'subjectId')),
            skipDuplicates: true,
          },
        },
      }

      await prisma.subject.upsert({
        where: { id: subjectId },
        create: items,
        update: items,
      })
      try {
        await prisma.lesson.createMany({
          data: lessons,
          skipDuplicates: true,
        })
        await prisma.tuition.createMany({
          data: tuitions as Tuition[],
          skipDuplicates: true,
        })
        console.log('completed ', subjectId, ' ', i + 1, ' of ', ids.length)
      } catch (error) {
        await prisma.student.delete({
          where: {
            id: subjectId,
          },
        })
        throw error
      }
    } else {
      const data = {
        id: subjectId,
        name: element?.kcmc as string,
        department: 'unknown',
        credit: 0,
        category: 'unknown',
        tooOld: true,
        tuitionHour: 0,
        tuitionHourDetail: '0-0-0-0-0',
      }
      await prisma.subject.upsert({
        create: data,
        update: data,
        where: {
          id: subjectId,
        },
      })
      console.log('no data , skipped', i + 1, ' of ', ids.length)
    }
  }
}

export async function seedCourses(offset = 0, locations) {
  console.log('导入全部课程')
  const subjects = await prisma.subject.findMany({
    select: {
      id: true,
    },
    where: {
      tooOld: false,
    },
  })
  const hasDataIds = (
    await prisma.course.findMany({
      select: {
        subjectId: true,
      },
      distinct: ['subjectId'],
    })
  ).map((e) => e.subjectId)

  const ids = subjects.map((e) => e.id).filter((i) => !hasDataIds.includes(i))

  for (let i = offset; i < ids.length; i++) {
    const id = ids[i]

    const { lessons, courses, tuitions } =
      (await getCourseStuffs(id, false, locations)) || {}

    if (courses?.length && lessons?.length) {
      try {
        await prisma.course.createMany({
          data: courses as Course[],
          skipDuplicates: true,
        })

        await prisma.lesson.createMany({
          data: lessons,
          skipDuplicates: true,
        })
        await prisma.tuition.createMany({
          data: tuitions as Tuition[],
          skipDuplicates: true,
        })
        console.log('completed ', id, ' ', i + 1, ' of ', ids.length)
      } catch (error) {
        console.log(error)
        console.log('error--- with Subject ', id)
        throw error
      }
    } else {
      await prisma.subject.update({
        data: {
          tooOld: true,
        },
        where: {
          id: id,
        },
      })
      console.log('no data , skipped', i + 1, ' of ', ids.length)
    }
  }
}
