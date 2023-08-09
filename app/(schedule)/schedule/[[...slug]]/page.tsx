import { NewLayout } from '@/components/common/NewLayout'
// import ScheduleLayoutTitle from '@/components/ScheduleLayoutTitle'
// import Schedule from '@/components/Timetable'
import prisma from '@/lib/prisma'
import { getTimetable } from '@/lib/service/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ScheduleLayoutTitle = dynamic(() => import("@/components/ScheduleLayoutTitle"), {
  // Do not import in server side
  ssr: false,
})
const Schedule = dynamic(() => import("@/components/Timetable"), {
  // Do not import in server side
  ssr: false,
})

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata> {
  // read route params
  const { slug } = params
  const [type, id, term, grade] = slug
  if (decodeURIComponent(type) === '[[...slug]]') {
    return {}
  }
  const { courses, owner, terms } = await getTimetable(
    type as OwnerType,
    id,
    term,
    grade
  )

  return {
    title: `${owner.name}@${owner.label}`,
    abstract:
      '中南大学' +
      `${owner.label}${owner.name}` +
      (term ? `${term}学期` : '') +
      '课表',
    description:
      '中南大学' +
      `${owner.label}${owner.name}` +
      (term ? `${term}学期` : '') +
      '课表',
  }
}

export default async function SchedulePage({ params }) {
  const { slug } = params
  const [type, id, term, grade] = slug
  if (decodeURIComponent(type) === '[[...slug]]') {
    return null
  }
  const { courses, owner, terms } = await getTimetable(
    type as OwnerType,
    id,
    term,
    grade
  )
  const title = (owner.label || '') + owner.name
  return (
    <NewLayout
      key={2}
      title={
        <ScheduleLayoutTitle
          title={owner.name}
          label={owner.label}
          terms={terms}
        />
      }
    >
      <div className="bg-slate-50">
        {
          <Schedule
            terms={terms}
            title={title}
            courses={courses}
            type={type}
            id={id}
          />
        }
      </div>
    </NewLayout>
  )
}

export async function generateStaticParams() {
  const students = await prisma.student.findMany({
    where: {
      grade: {
        gte: '2020',
      },
    },
    distinct: ['className'],
  })

  const params = students
    .filter((e, i) => i % 9 == 0)
    .map((s) => {
      return {
        slug: ['student', s.id],
      }
    })

  return params
}
