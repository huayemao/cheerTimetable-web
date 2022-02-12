// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { searchByName } from '../../lib/api'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, q } = req.query
  res.status(200).json(searchByName(type, q))
}
