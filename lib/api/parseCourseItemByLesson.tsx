import { parseSlot } from 'lib/parseCourseItem'
import { Course, Lesson, Subject, Tuition, Teacher } from '@prisma/client'
import { CourseItem, WeekInterval } from 'lib/types/CourseItem'
import { MyLesson } from 'lib/types/Lesson'

export function parseCourseItemByLesson(lesson: MyLesson): CourseItem {
  const mapping = {
    0: WeekInterval.none,
    1: WeekInterval.even,
    2: WeekInterval.odd,
  }
  return {
    seq: lesson.id,
    courseId: lesson.courseId,
    name: lesson.course.subject.name,
    location: lesson.location,
    teachers: lesson.tuition.map((e) => e.teacher),
    studentCount: lesson.course.electCount,
    classId: lesson.course.className,
    slot: parseSlot(lesson.timeSlot),
    weeks: lesson.weeks,
    weekInterval: mapping[lesson.weekFreq],
    term: lesson.course.term,
    credit: lesson.course.subject.credit,
    category: lesson.course.subject.category,
  }
}
