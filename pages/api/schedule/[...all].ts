import { getTimetable } from 'lib/api/getTimetable'
import { OwnerType } from 'lib/types/Owner'
import type { NextApiRequest, NextApiResponse } from 'next'

export type Schedule = Awaited<ReturnType<typeof getTimetable>>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { all } = req.query
  const [type, id] = all as string[]

  // todo: https://blog.logrocket.com/methods-for-typescript-runtime-type-checking/
  const { courses, owner } = await getTimetable(type as OwnerType, id)

  res.json({
    courses,
    owner,
  })
}
