import { searchOwner } from 'lib/service/searchOwner'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query

  const data = await searchOwner(query)
  res.json(data)
}
