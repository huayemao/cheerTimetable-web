import { getTimetableByStudentId } from 'lib/api/getTimetableByStudentId'
import prisma from 'lib/prisma'
import Link from 'next/link'

export default async function Home({ params, searchParams }) {
  const { id } = params
  const data = await getTimetableByStudentId(id)

  return <div className="bg-slate-50">{JSON.stringify(data)}</div>
}
