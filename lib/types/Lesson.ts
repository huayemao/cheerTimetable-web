import {
  Lesson,
  Location,
  Tuition,
  Teacher,
  Course,
  Subject,
} from '@prisma/client'

export type MyLesson = Lesson & {
  location: Location
  tuition: (Tuition & {
    teacher: Teacher
  })[]
  course: Course & {
    subject: Subject
  }
}
