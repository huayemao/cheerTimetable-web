import { getTimetable } from '@/lib/service/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import Schedule from '@/components/Timetable'
import dynamic from 'next/dynamic'

// 还是不行，在上一级加载全量的总行了吧。。。；
// 但如果那样，在这一级获取步道原来的数据呀，或者就是一模一样的请求，这样似乎能够缓存？
// 但似乎也不意味着不去请求服务端，肯定都得请求。。。
// 总之 shallow link 的特性看起来是没有了

// 干脆把这个路由重新放到 pages ，这样起码非默认学期之间跳转可以 shallow

// https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

export default async function ScheduleByTerm({ params }) {
  const { id, type, term } = params
  const { courses, owner } = await getTimetable(type as OwnerType, id, term)
  return (
    <div className="bg-slate-50">
      {<Schedule courses={courses} type={type} id={id} />}
    </div>
  )
}
