import { Switch } from '@headlessui/react'
import Layout from 'components/common/Layout'
import TermSelect from 'components/TermSelect'
import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content } from '../../components/Content'
import { getTimetable } from '../../lib/api/getTimetable'
import { TERMS } from '../../constants'
import { CourseItem } from 'lib/types/CourseItem'
import useSWR from 'swr'
import { Schedule } from 'pages/api/schedule/[...all]'
import { fetcher } from 'lib/fetcher'

// 几个问题
// title 应该在哪里去拿？难道不是 props 吗？但是既然客户端渲染了，就将错就错吧
// isFallback 是干什么的

type Props = Awaited<ReturnType<typeof getStaticProps>>['props']

const TimetablePage = ({ type, id }: Props) => {
  // 是否 props 中将 query 传下来？
  const router = useRouter()
  const dispath = usePreferenceDispatch()
  const { show7DaysOnMobile } = usePreference()

  const { term = TERMS[0] } = router.query

  // 为何 fatch 了两次？
  const { data, error } = useSWR<Schedule>(
    `/api/schedule/${type}/${id}/`,
    fetcher
  )

  const loading = !data && !error

  const { courses, owner } = data || {}

  const title = loading ? '课表' : `${owner?.label} ${owner?.name}`

  const terms = Array.from(new Set(courses?.map((e) => e.term)))?.sort(
    (a: string, b: string) => b.localeCompare(a)
  ) as string[]

  // todo: 抽出去
  useEffect(() => {
    // 这个没有 work
    if (!terms.length) return
    if (!router.query.term) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, term: terms[0] },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [terms])

  // todo: 以前 layout 里面的学期选择器、天数切换按钮等
  // 这里以前为什么要判断这么多呀? 可能是因为 fallback: true ，现在不需要了，全 CSR 了
  // todo: calc min h
  return (
    <div className="flex flex-col items-center overflow-y-auto bg-slate-50 min-h-[70vh]">
      {/* {title} */}
      {courses && (
        <Content
          title={title}
          // getStaticProps runs in the background when using fallback: true
          courses={courses.filter((e) => e.term === term)}
          icsUrl={`${window.location.origin}/api/ical/${type}/${id}/${term}.ics`}
        />
      )}
    </div>
  )
}

export default TimetablePage

export async function getStaticProps(context) {
  const { all } = context.params
  const [type, id] = all as string[]

  return {
    props: {
      type,
      id,
    },
  }
}

export async function getStaticPaths(context) {
  return {
    paths: [
      {
        params: { all: ['student', '8305180722'] },
      },
    ],
    fallback: 'blocking',
  }
}
