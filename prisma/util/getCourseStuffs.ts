// @ts-nocheck
import { Course, Subject, Tuition } from '@prisma/client'
import { compact, groupBy, map, omit, pull } from 'lodash'
import { TERMS } from '../../constants'
import { getLessons, LessonRes1 } from '../api/getLessons'
import { getLessonsById, LessonRes } from '../api/getLessonsByID'
import { getSubjectCategory } from '../api/getSubjectCategory'
import { getSubjectMeta } from './getFromMeta'
import { mapByTerms } from './mapByTerm'
import { parseLesson } from './parseLessons'
import { parseSubject } from './parseSubject'

export const getInt = (str: string | undefined) => parseInt(str?.trim() || '0')

function getClassName(value: string): string {
  return (
    (value && (value.length > 60 ? value.slice(0, 61) + '...' : value)) ||
    'unknown'
  )
}

// 恭喜你得到了一坨屎山
export async function getCourseStuffs(
  subjectId,
  needSubjectCat = false,
  terms = TERMS
) {
  const { jx02id, kcmc: name } = (await getSubjectMeta(subjectId)) || {}
  if (!jx02id) {
    // 要不要这个统一提到前面处理
    console.log('没有 jx02id, ', subjectId)
    return null
  }
  const [items, itemsAlt, cats = []] = await Promise.all<
    [
      (LessonRes & { term: string })[],
      (LessonRes1 & { term: string })[],
      string[]
    ]
  >([
    mapByTerms((term) => getLessonsById('course', jx02id, term), terms),
    mapByTerms((term) => getLessons({ term, jx02id }), pull(terms,'2014-2015-1')), // 全校总课表，获取太早的年份将没有返回结果，导致报错
    needSubjectCat
      ? mapByTerms((term) => getSubjectCategory(jx02id, term))
      : undefined,
  ])

  if (!items.length) {
    return null
  }


  const subject: Subject = parseSubject(subjectId, name, items, itemsAlt, cats)

  const groups = groupBy(compact(items), (e) => e.开课编号 + e.上课班级) // 上课班级可能会显示不全甚至没有，不能单独用它来分组
  const groupsAlt = groupBy(
    compact(itemsAlt),
    (e) => e.term + '_' + e.课堂名称 + e.教学班名称 + e.上课班级名称 //课堂名称相同，教学班名称可能不同
  )

  // parseCourse 需要 items 和 itemsAlt 的上下文
  // 需要从两处获得的 lessons 中提取更多信息，到 course 中
  const courses: Course[] = map(groupsAlt, (v) =>
    parseCourse(v, subjectId, items)
  )

  const lessons = await Promise.all(
    map(compact(items), async (v) => await parseLesson(v))
  )

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
}

function parseCourse(
  v: (LessonRes1 & { term: string })[],
  subjectId: string,
  items
): Course {
  let id: string = getCourseId(v, items)

  return {
    id,
    subjectId,
    term: v[0].term,
    className: getClassName(v[0].教学班名称.trim()),
    electCount: getInt(v[0].选课人数),
    mergeCount: getInt(v[0].合班人数),
  }
}

function getCourseId(v: (LessonRes1 & { term: string })[], items) {
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
        items.filter((e1) => e1.term === e.term && e1.上课班级.trim() === value)
          .length < 3 // 3个上课班级相同，认为不可信 // 有可能名字太长，有一个有截断
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
