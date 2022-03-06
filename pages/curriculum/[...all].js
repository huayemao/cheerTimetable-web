import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getTimeTable } from 'lib/api/getTimeTable'
import parseCourseItem from 'lib/parseCourseItem'
import { TimetableTitle } from 'components/Timetable/index.ts'
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
import { getTimeTableOwner } from '../../lib/api/getTimeTableOwner'

function TimetablePage(props) {
  const router = useRouter()
  const loading = useLinkTransition()
  const dispath = usePreferenceDispatch()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const [type, id, term = '2021-2022-2'] = router.query.all

  return (
    <Layout
      extraNavBarChildren={<TimetableTitle owner={props.owner} />}
      renderMenuItems={(toggleCollapsed) => (
        <div className="menu-wrapper bg-white">
          <TermSelect handleOnchange={toggleCollapsed} />
          <Select
            options={[
              { label: '展示5天', key: '5' },
              { label: '展示7天', key: '7' },
            ]}
            onChange={(key) => {
              dispath({ type: `SHOW_${key}_DAYS_ON_MOBILE` })
              toggleCollapsed()
            }}
            defaultValue={'5'}
          />
        </div>
      )}
      sidebarContent={
        <>
          <div className="w-full text-center">
            <Link href={'/'}>
              <a
                className={
                  'text-3xl text-blue-400 hover:text-blue-500 lg:flex-1'
                }
              >
                绮课
              </a>
            </Link>
          </div>
          <TermSelect type={type} id={id} />
          <div className="w-full text-sm text-slate-500 hover:text-blue-500">
            <a
              href="https://github.com/huayemao/cheerTimetable-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <svg
                height="1.5em"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                width="1.5em"
                data-view-component="true"
                className="octicon octicon-mark-github v-align-middle mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                ></path>
              </svg>
              github
            </a>
          </div>
        </>
      }
    >
      <Head>
        <title>{props.owner.name}的课表-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center overflow-y-auto py-2">
        {process.browser && (
          <Content
            {...props}
            icsUrl={`https://cheer-timetable.vercel.app/api/ical/${type}/${id}/${term}.ics`}
            loading={loading}
          ></Content>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { all } = context.params
  const [type, id, term = '2021-2022-2'] = all

  const { courses: rawCourses, rawUrl } = await getTimeTable(type, id, term)
  const courses = rawCourses.map(parseCourseItem)

  const owner = getTimeTableOwner(type, id)

  return {
    props: {
      courses,
      owner,
      rawUrl,
    },
    revalidate: 60 * 60 * 48,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      all: ['student', '8305180722'],
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: true }
}

export default TimetablePage
