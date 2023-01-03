import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'
import { useRouter } from 'next/router'
import ScheduleComponent from '../../components/Timetable'
import { TERMS } from '../../constants'
import useSWR from 'swr'
import { Schedule } from 'pages/api/schedule/[...all]'
import { fetcher } from 'lib/fetcher'
import { OwnerType } from 'lib/types/Owner'

// 几个问题
// title 应该在哪里去拿？难道不是 props 吗？但是既然客户端渲染了，就将错就错吧
// isFallback 是干什么的

type Props = Awaited<ReturnType<typeof getStaticProps>>['props']

const TimetablePage = ({ type, id }: Props) => {
  // 是否 props 中将 query 传下来？

  // 为何 fatch 了两次？
  const { data, error } = useSWR<Schedule>(
    `/api/schedule/${type}/${id}/`,
    fetcher
  )

  const loading = !data && !error

  const { courses, owner } = data || {}

  const title = loading ? '课表' : `${owner?.label} ${owner?.name}`

  // todo: 以前 layout 里面的学期选择器、天数切换按钮等
  // 这里以前为什么要判断这么多呀? 可能是因为 fallback: true ，现在不需要了，全 CSR 了
  // todo: calc min h
  return (
    <div className="">
      {courses && (
        <ScheduleComponent
          type={type as OwnerType}
          id={id}
          title={title}
          courses={courses}
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
