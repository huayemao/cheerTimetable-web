import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getNameById } from 'lib/api/getMeta'
import { getTimeTable } from 'lib/api/getTimeTable'
import { Timetable, TimetableTitle } from 'components/Timetable'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import Layout from 'components/Layout'
import Container from 'components/Container'
import Modal from 'components/Modal'
import Head from 'next/head'
import { keyBy } from 'lodash'
import { SideBar } from 'components/SideBar'
import TermSelect from 'components/TermSelect'
import Select from 'components/Select'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import Loading from '../../components/Loading'
import {
  usePreferenceDispatch,
  usePreference,
} from 'contexts/preferenceContext'

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
      extraNavBarChildren={
        <TimetableTitle
          ownerName={props.ownerName}
          ownerType={props.ownerType}
        />
      }
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
    >
      <Head>
        <title>{props.ownerName}的课表-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-5 ">
        <SideBar>
          <TermSelect type={type} id={id} />
        </SideBar>
        <div className="col-span-5 flex flex-col items-center overflow-y-auto py-2 lg:col-span-4">
          {process.browser && (
            <Content
              {...props}
              icsUrl={`https://cheer-timetable.vercel.app/api/ical/${type}/${id}/${term}.ics`}
              loading={loading}
            ></Content>
          )}
        </div>
      </div>
    </Layout>
  )
}

function Content({ ownerName, ownerType, data, loading, icsUrl }) {
  const isMobile = useMediaQuery('(max-width: 768px)', true, false)
  const { courses, rawUrl } = data
  const { show7DaysOnMobile } = usePreference()
  if (loading) {
    return <Loading size={60} />
  }
  return (
    <>
      {courses?.length ? (
        <Timetable
          courses={courses}
          show7days={!isMobile || (isMobile && show7DaysOnMobile)}
        ></Timetable>
      ) : (
        '这里一节课都没有呀'
      )}
      <div className=" mx-6 mt-4 self-start break-all font-thin leading-6 text-blue-500">
        <h4 className="text-medium text-gray-500"> 日历订阅 (experimental):</h4>
        <div className="text-xs">{icsUrl}</div>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const { all } = context.params
  const [type, id, term = '2021-2022-2'] = all

  const data = await Promise.all(
    [term].map((term) => getTimeTable(type, id, term))
  )
  const timetables = Object.fromEntries(data.map((e, i) => [[term][i], e]))

  const typeMapping = {
    student: '学生',
    teacher: '教职工',
    location: '授课地点',
  }
  const ownerType = typeMapping[type]

  const ownerName = getNameById(type, id)

  return {
    props: {
      data: timetables[term],
      ownerType,
      ownerName,
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
