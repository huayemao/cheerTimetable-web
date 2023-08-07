import Schedule from '@/components/Timetable'
import prisma from '@/lib/prisma'
import { getTimetable } from '@/lib/service/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import baseTerms from 'constants/terms'

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

export default async function SchedulePage({ params }) {
  const { slug } = params
  const [type, id, term] = slug
  if (decodeURIComponent(type) === '[[...slug]]') {
    return null
  }
  const { courses, owner, terms } = await getTimetable(
    type as OwnerType,
    id,
    term
  )
  const title = (owner.label || '') + owner.name
  return (
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
  )
}

export async function generateStaticParams() {
  const terms = baseTerms.slice(0, 4)

  const students = await prisma.student.findMany({
    where: {
      grade: {
        gte: '2020',
      },
    },
    distinct: ['className'],
  })
  const params = terms.flatMap((term) => {
    return students.map((s) => {
      return {
        slug: ['student', s.id, term],
      }
    })
  })

  return params
}
