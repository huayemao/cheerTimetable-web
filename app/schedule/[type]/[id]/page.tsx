import { getTimetable } from '@/lib/api/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import Schedule from '@/components/Timetable'
import dynamic from 'next/dynamic'


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
