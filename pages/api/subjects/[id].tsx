import { getCoursesBySubject } from 'lib/api/getCoursesBySubject'
import type { NextApiRequest, NextApiResponse } from 'next'

// http://localhost:3000/api/ical/student/8305180722/2018-2019-2.ics

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const subjects = await getCoursesBySubject(id)
  res.json(subjects)
}
