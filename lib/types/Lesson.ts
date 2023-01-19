import {
  Lesson,
  Location,
  Tuition,
  Teacher,
  Course,
  Subject,
} from '@prisma/client'

export type MyLesson = Lesson & {
  course: Course & {
    subject: Subject
  }
  tuition: (Tuition & {
    teacher: {
      name: string
      id: string
    }
  })[]
  location: {
    name: string
    id: string
    building: string
  }
}
