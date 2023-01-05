import { getTimetable } from '@/lib/api/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
// import Schedule from '@/components/Timetable'
import dynamic from 'next/dynamic'

const Schedule = dynamic(() => import('@/components/Timetable'), {
  ssr: false,
  loading: () => <p>...</p>,
})

// https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration
export const revalidate = 3600; // revalidate every hour

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

export default async function Home({ params, searchParams }) {
  const { id, type } = params
  const { term } = searchParams
  const { courses, owner } = await getTimetable(type as OwnerType, id, term)
  return (
    <div className="bg-slate-50">
      {<Schedule courses={courses} type={type} id={id} />}
    </div>
  )
}
