import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from 'components/common/Layout'
import Head from 'next/head'
import { usePreferenceDispatch } from 'contexts/preferenceContext'
import prisma from '../../lib/prisma'
import { Enrollment, Student, Subject, Course } from '@prisma/client'
import List from 'components/common/List'
import { SubjectPreview } from 'components/PreviewCards/SubjectPreview'

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
    <Layout
      title={subject?.name}
      sidebarContent={<SubjectPreview disableLink subject={subject} />}
    >
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
                  <span className="font-medium text-blue-400">#{i + 1}</span>
                  &emsp;
                  {e.className}&emsp;
                  {e.term}&emsp;
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
      courses: {
        orderBy: {
          term: 'desc',
        },
        include: {
          lessons: {
            include: {
              tuition: {
                select: {
                  teacher: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  return {
    props: {
      subject: JSON.parse(JSON.stringify(subject)),
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
