import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from 'components/common/Layout'
import Head from 'next/head'
import prisma from '../../lib/prisma'
import { Enrollment, Student, Subject, Course } from '@prisma/client'
import List from 'components/common/List'

function CoursePage({
  course,
}: {
  course: Course & {
    subject: Subject
    enrollments: (Enrollment & {
      student: Student
    })[]
  }
}) {
  const router = useRouter()

  const { id } = router.query

  return (
    <Layout
      extraNavBarChildren={
        <div className="text-xl font-light text-blue-500">
          {router.isFallback ? '加载中' : course.subject.name}
        </div>
      }
    >
      {router.isReady && !router.isFallback && (
        <>
          <Head>
            <title>{course?.subject?.name || ''}-绮课</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="flex min-h-full flex-col items-center overflow-y-auto py-2 shadow-lg lg:mx-20">
            <h2 className="text-lg font-light text-blue-500">
              {course.className}
            </h2>
            <List
              data={course.enrollments}
              renderListItem={(e, i) => (
                <Link href={`/curriculum/student/${e.student.id}`}>
                  <a>
                    <span className="font-medium text-blue-400">#{i + 1}</span>
                    &emsp;
                    <span className="text-lg">{e.student.name}</span>&emsp;
                    {e.student.facultyName} {e.student.className}
                  </a>
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
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  })

  return {
    props: {
      course,
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
