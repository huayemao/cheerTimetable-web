import { NewLayout } from '@/components/common/NewLayout'
// import ScheduleLayoutTitle from '@/components/ScheduleLayoutTitle'
// import Schedule from '@/components/Timetable'
import prisma from '@/lib/prisma'
import { getTimetableByProfessionName } from '@/lib/service/getTimetable'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ScheduleLayoutTitle = dynamic(
  () => import('@/components/ScheduleLayoutTitle'),
  {
    // Do not import in server side
    ssr: false,
  }
)
const Schedule = dynamic(() => import('@/components/Timetable'), {
  // Do not import in server side
  ssr: false,
})

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string[] }
  searchParams: {
    grade?: string
  }
}): Promise<Metadata> {
  // read route params
  const { slug } = params
  const { grade } = searchParams
  const [id, term] = slug

  const { courses, owner, terms, grades } = await getTimetableByProfessionName(
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

export default async function SchedulePage({ params, searchParams }) {
  const { slug } = params
  const [id, term] = slug
  const { grade } = searchParams

  const { courses, owner, terms, grades } = await getTimetableByProfessionName(
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
          grades={grades}
          grade={grade}
        />
      }
    >
      <div className="bg-slate-50">
        {
          <Schedule
            terms={terms}
            title={title}
            courses={courses}
            /* @ts-ignore */
            type={'profession'}
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
    distinct: ['professionName'],
  })

  const params = students
    .filter((e, i) => i % 4 == 0)
    .map((s) => {
      return {
        slug: ['student', s.id],
      }
    })

  return params
}
