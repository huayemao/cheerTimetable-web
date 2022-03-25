import Container from 'components/Container'
import Layout from 'components/Layout'
import Modal from 'components/Modal'
import Select from 'components/Select'
import { SideBar } from 'components/SideBar'
import TermSelect from 'components/TermSelect'
import { TimetableTitle } from 'components/Timetable/index'
import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { keyBy } from 'lodash'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content } from '../../components/Content'
import { getTimetable } from '../../lib/api/getTimetable'

function TimetablePage(props) {
  const router = useRouter()
  const loading = useLinkTransition()
  const dispath = usePreferenceDispatch()
  const { show7DaysOnMobile } = usePreference()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const [type, id] = router.query.all as string[]
  const { term = '2021-2022-2' } = router.query

  return (
    <Layout
      extraNavBarChildren={<TimetableTitle owner={props.owner} />}
      renderMenuItems={(toggleCollapsed) =>
        process.browser && (
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
              defaultValue={show7DaysOnMobile ? '7' : '5'}
            />
          </div>
        )
      }
      sidebarContent={<>{process.browser && <TermSelect />}</>}
    >
      <Head>
        <title>{props.owner.name}的课表-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center overflow-y-auto mb-2">
        {process.browser && (
          <Content
            courses={props.courses.filter((e) => e.term === term)}
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
  const [type, id] = all

  const { courses, owner } = await getTimetable(type, id)

  return {
    props: {
      courses,
      owner,
      // rawUrl,
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
