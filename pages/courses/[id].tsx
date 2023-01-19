import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from 'components/common/Layout'
import Head from 'next/head'
import prisma from '../../lib/prisma'
import {
  Enrollment,
  Student,
  Subject,
  Course,
  Lesson,
  Tuition,
  Teacher,
  Location,
} from '@prisma/client'
import List from 'components/common/List'
import { parseCourseItemByLesson } from '@/lib/utils/parseCourseItemByLesson'
import { CourseDetail } from 'components/Timetable/CourseDetail'
import { SubjectPreview } from 'components/PreviewCards/SubjectPreview'
import LessonPreview from 'components/Timetable/Cell'
import MappedTable from 'components/MappedTable'

function CoursePage({
  course,
}: {
  course: Course & {
    subject: Subject
    lessons: (Lesson & {
      location: Location
      tuition: (Tuition & {
        teacher: Teacher
      })[]
      course: Course & {
        subject: Subject
      }
    })[]
    enrollments: Enrollment & {
      student: Student
    }
  }
}) {
  const router = useRouter()

  const { id } = router.query

  const courseItems = course?.lessons.map(parseCourseItemByLesson)

  const label = course ? course.subject.name : null

  const info = course ? (
    <>
      <p className="px-4 font-light">
        开课编号：{course.id}
        <br /> 学期：{course.term}
      </p>
      <SubjectPreview subject={course.subject} />
    </>
  ) : null

  return (
    <Layout
      className="bg-slate-50 md:px-10 lg:px-20 lg:py-6"
      title={router.isFallback ? '加载中' : label}
      menuItems={info}
      sidebarContent={info}
    >
      {(!router.isFallback || (router.isFallback && router.isReady)) && course && (
        <>
          <div className="m-4 lg:mx-0">
            <MappedTable
              data={courseItems.map((e) => ({
                周次: e.weeks + ' ' + e.weekInterval,
                星期: e.slot.day,
                节次:
                  e.slot.rowIds
                    .map((i) => [i * 2 - 1, i * 2].join('-'))
                    .join(',') + '节',
                地点: e.location.name,
                授课教师: e.teachers.map((e) => e.name).join(''),
              }))}
            />
            {/* todo: lessonPreview 需要加上时段等 */}
          </div>
          {/* todo:支持折叠 */}
          <div className="flex flex-col items-center overflow-y-auto py-2 shadow-lg ">
            <h2 className="text-lg font-light text-blue-500">
              教学班 —— {course.className}
            </h2>
            <List
              data={course.enrollments}
              renderListItem={(e, i) => (
                <Link href={`/schedule/student/${e.student.id}`}>
                  <span className="font-medium text-blue-400">#{i + 1}</span>
                  &emsp;
                  <span className="text-lg">{e.student.name}</span>&emsp;
                  {e.student.facultyName} {e.student.className}
                </Link>
              )}
            />
          </div>
        </>
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { id } = context.params

  const course = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      subject: true,
      lessons: {
        include: {
          location: true,
          tuition: {
            include: {
              teacher: true,
            },
          },
          course: {
            include: {
              subject: true,
            },
          },
        },
      },
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  })

  return {
    props: {
      course: JSON.parse(JSON.stringify(course)),
    },
    revalidate: 60 * 60 * 48,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      id: '202120222001579',
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: true }
}

export default CoursePage
