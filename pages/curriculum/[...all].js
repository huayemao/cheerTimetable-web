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
          <TermSelect type={type} id={id} />
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
