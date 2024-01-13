/* eslint-disable @next/next/no-server-import-in-page */
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (typeof email !== 'string') {
    return NextResponse.json({ error: 'wrong params' }, { status: 400 })
  }

  const exists = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  if (exists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        password: await hash(password, 10),
        username: email,
      },
    })
    return NextResponse.json(user)
  }
}
