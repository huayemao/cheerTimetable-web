import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { TimetableTitle } from 'components/Timetable/index'
import Layout from 'components/Layout'
import Container from 'components/Container'
import Modal from 'components/Modal'
import Head from 'next/head'
import { keyBy } from 'lodash'
import { SideBar } from 'components/SideBar'
import TermSelect from 'components/TermSelect'
import Select from 'components/Select'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { usePreferenceDispatch } from 'contexts/preferenceContext'
import { Content } from '../../components/Content'
import { OwnerType } from '../../lib/types/Owner'
import prisma from '../../lib/prisma'
import { Enrollment, Student, Subject, Course } from '@prisma/client'
import List from 'components/List'

function CoursePage({
  subject,
}: {
  subject: Subject & {
    courses: Course[]
  }
}) {
  const router = useRouter()
  const loading = useLinkTransition()
  const dispath = usePreferenceDispatch()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { id } = router.query

  return (
    <Layout
      extraNavBarChildren={
        <div className="text-xl font-light text-blue-500">{subject.name}</div>
      }
    >
      <Head>
        <title>{subject.name}-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center overflow-y-auto py-2 shadow-lg lg:mx-20">
        {/* <h2 className="text-lg font-light text-blue-500">{course.className}</h2> */}
        <List
          data={subject.courses}
          renderListItem={(e: Course, i) => (
            <a>
              <span className="font-medium text-blue-400">#{i + 1}</span>
              &emsp;
              {e.className}&emsp;
              {e.term}&emsp;
            </a>
          )}
        />
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { id } = context.params

  const subject = await prisma.subject.findUnique({
    where: {
      id: id,
    },
    include: {
      courses: true,
    },
  })

  return {
    props: {
      subject,
    },
    revalidate: 60 * 60 * 48,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      id: '320121X1',
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: true }
}

export default CoursePage
