import { Profession } from '@/components/Profession'
import {
  getDepartmentsAndProfessions,
  getProfessionsByDepartmentName
} from '@/lib/service/profession'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { name: string }
}): Promise<Metadata> {
  // read route params
  const { name } = params

  return {
    title: `${decodeURIComponent(name || '')}`,
    abstract: '中南大学' + decodeURIComponent(name || ''),
    description: '中南大学' + decodeURIComponent(name || ''),
  }
}

export default async function DepartmentPage({ params }) {
  const { name } = params
  const professions = await getProfessionsByDepartmentName(
    decodeURIComponent(name as string)
  )

  return (
    <div className="bg-slate-50 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {professions.map((e) => {
        return <Profession key={e.professionName} data={e}></Profession>
      })}
    </div>
  )
}

export async function generateStaticParams() {
  const data = await getDepartmentsAndProfessions()
  const params = Object.values(data)
    .flat()
    .map((e) => {
      return {
        name: e.professionName,
      }
    })

  return params
}
