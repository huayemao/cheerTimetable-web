import { toughCookie } from 'jsdom'
import prisma from './prisma.js'

export async function retrieveCookie() {
  const { value } =
    (await prisma.cookie.findFirst({ orderBy: { date: 'desc' } })) || {}
  return value
}

function parseCookie(str) {
  return str
    .split(',')
    .map((e) => toughCookie.parse(e).cookieString())
    .join('; ')
}

export default async function fetchWithCookie(url, cookie, otherOptions = {}) {
  console.log({
    credentials: 'include',
    headers: {
      ...(otherOptions.headers || {}),
      Cookie: cookie,
    },
  })
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      ...(otherOptions.headers || {}),
      Cookie: cookie,
    },
  })
  if (res.headers.has('set-cookie')) {
    const cookieStr = parseCookie(res.headers.get('set-cookie'))

    fetchWithCookie(
      'http://csujwc.its.csu.edu.cn/kblogin.jsp?f=3&type=jg',
      cookieStr
    )

    const finalRes = await fetchWithCookie(url, cookieStr, otherOptions)

    prisma.cookie.create({
      data: { value: cookieStr, date: new Date().toLocaleString() },
    })

    return finalRes
  } else {
    return res
  }
}
