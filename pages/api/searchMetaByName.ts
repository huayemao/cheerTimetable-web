// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { searchByName } from "../../lib/api/getMeta"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, q } = req.query
  if (type) {
    res.status(200).json(searchByName(type, q))
  } else {
    const types = ['student', 'teacher', 'location']
    const entries = types.map((e) => [e, searchByName(type, q)])
    const obj = Object.fromEntries(entries)
    res.status(200).json(obj)
  }
}
