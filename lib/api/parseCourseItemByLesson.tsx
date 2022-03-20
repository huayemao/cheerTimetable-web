import { parseSlot } from 'lib/parseCourseItem';
import { Course, Lesson, Subject, Tuition, Teacher } from '@prisma/client';
import { CourseItem, WeekInterval } from 'lib/types/CourseItem';


export function parseCourseItemByLesson(
  lesson: Lesson & {
    tuition: (Tuition & {
      teacher: Teacher;
    })[];
    course: Course & {
      subject: Subject;
    };
  }
): CourseItem {
  const mapping = {
    0: WeekInterval.none,
    1: WeekInterval.even,
    2: WeekInterval.odd,
  };
  return {
    seq: lesson.id,
    courseId: lesson.courseId,
    name: lesson.course.subject.name,
    locationId: lesson.locationId,
    teachers: lesson.tuition.map((e) => e.teacher),
    studentCount: lesson.course.electCount,
    classId: lesson.course.className,
    slot: parseSlot(lesson.timeSlot),
    weeks: lesson.weeks,
    weekInterval: mapping[lesson.weekFreq],
  };
}
