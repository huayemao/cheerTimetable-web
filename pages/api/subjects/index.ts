import { getSubjects } from 'lib/service/getSubjects'
import type { NextApiRequest, NextApiResponse } from 'next'

// http://localhost:3000/api/ical/student/8305180722/2018-2019-2.ics

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q, departmentName, offset, pageSize, publicElectiveOnly } = req.query
  const subjects = await getSubjects(
    q,
    departmentName as string,
    {
      offset: (offset && Number(offset as string)) || 0,
      pageSize: (pageSize && Number(pageSize as string)) || 0,
    },
    publicElectiveOnly as string
  )
  res.json(subjects)
}
