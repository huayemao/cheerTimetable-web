import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from 'components/common/Layout'
import Container from 'components/Container'
import Modal from 'components/common/Modal'
import Head from 'next/head'
import { keyBy } from 'lodash'
import { SideBar } from 'components/SideBar'
import TermSelect from 'components/TermSelect'
import Select from 'components/common/Select'
import { usePreferenceDispatch } from 'contexts/preferenceContext'
import { Content } from '../../components/Content'
import { OwnerType } from '../../lib/types/Owner'
import prisma from '../../lib/prisma'
import { Enrollment, Student, Subject, Course } from '@prisma/client'
import List from 'components/common/List'

function CoursePage({
  subject,
}: {
  subject: Subject & {
    courses: Course[]
  }
}) {
  const router = useRouter()
  const dispath = usePreferenceDispatch()

  const { id } = router.query

  return (
    <Layout title={subject?.name}>
      {!router.isFallback && router.isReady && (
        <>
          <Head>
            <title>{subject.name}-绮课</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="flex flex-col items-center overflow-y-auto py-2 shadow-lg lg:mx-20">
            <List
              data={subject.courses}
              renderListItem={(e: Course, i) => (
                <Link href={`/courses/${e.id}`}>
                  <a>
                    <span className="font-medium text-blue-400">#{i + 1}</span>
                    &emsp;
                    {e.className}&emsp;
                    {e.term}&emsp;
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
