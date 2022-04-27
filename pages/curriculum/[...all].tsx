import { Switch } from '@headlessui/react'
import Container from 'components/Container'
import Layout from 'components/common/Layout'
import Modal from 'components/common/Modal'
import Select from 'components/common/Select'
import TermSelect from 'components/TermSelect'
import { TimetableTitle } from 'components/Timetable/index'
import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'
import { keyBy } from 'lodash'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content } from '../../components/Content'
import { getTimetable } from '../../lib/api/getTimetable'

function TimetablePage(props) {
  const router = useRouter()
  const dispath = usePreferenceDispatch()
  const { show7DaysOnMobile } = usePreference()

  const [type, id] = (router.query.all || []) as string[]
  const { term = '2021-2022-2' } = router.query

  return (
    <Layout
      title={<TimetableTitle owner={props.owner || {}} />}
      menuItems={
        (process.browser && (
          <>
            <TermSelect />
            {show7DaysOnMobile}
            <div className="flex items-center justify-between">
              <div className="text-gray-700">展示7天</div>
              <Switch
                checked={show7DaysOnMobile}
                onChange={(v) => {
                  dispath({ type: `SHOW_7_DAYS_ON_MOBILE`, payload: v })
                }}
                className={`${show7DaysOnMobile ? 'bg-blue-500' : 'bg-blue-200'}
          relative inline-flex h-[24px] w-[48px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">展示7天</span>
                <span
                  aria-hidden="true"
                  className={`${
                    show7DaysOnMobile ? 'translate-x-6' : 'translate-x-0'
                  }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          </>
        )) ||
        null
      }
      sidebarContent={<>{process.browser && <TermSelect />}</>}
    >
      {router.isReady && !router.isFallback && (
        <>
          <Head>
            <title>{props.owner.name}的课表-绮课</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="mb-2 flex flex-col items-center overflow-y-auto">
            {process.browser && (
              <Content
                courses={props.courses.filter((e) => e.term === term)}
                icsUrl={`https://cheer-timetable.vercel.app/api/ical/${type}/${id}/${term}.ics`}
              />
            )}
          </div>
        </>
      )}
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
