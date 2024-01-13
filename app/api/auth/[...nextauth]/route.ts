import prisma from '@/lib/prisma'
import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {}
        if (!email || !password) {
          throw new Error('Missing username or password')
        }
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        })
        // if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error('Invalid username or password')
        }
        return { ...user, id: String(user.id) }
      },
    }),
  ],
  // 这两个 callback 都要写
  callbacks: {
    session: async ({ session, user, token }) => {
      if (token) {
        // @ts-ignore
        session.user = token.user
      }
      return Promise.resolve(session)
    },
    jwt: async ({ token, user, account }) => {
      const isSignIn = user ? true : false
      if (isSignIn) {
        // @ts-ignore
        token.user = user
      }
      return Promise.resolve(token)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
