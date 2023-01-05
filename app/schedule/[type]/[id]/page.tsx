import { getTimetable } from '@/lib/api/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import prisma from 'lib/prisma'
import Link from 'next/link'
import Schedule from '@/components/Timetable'

export default async function Home({ params, searchParams }) {
  const { id, type } = params
  const { courses, owner } = await getTimetable(type as OwnerType, id)

  return (
    <div className="bg-slate-50">
      {<Schedule courses={courses} type={type} id={id}/>}
    </div>
  )
}
