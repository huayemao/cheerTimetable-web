import { toughCookie } from 'jsdom'
import prisma from './prisma.js'
import { map } from 'lodash'

export async function retrieveCookie() {
  const res = await prisma.cookie.findFirst({ orderBy: { date: 'desc' } })
  const { value: cookie } = res || {}
  console.log({ cookie })
  return cookie
}

function parseCookie(str) {
  return str
    .split(',')
    .map((e) => toughCookie.parse(e).cookieString())
    .join('; ')
}

export default async function fetchWithCookie(url, cookie, otherOptions = {}) {
  const newOptions = {
    ...otherOptions,
    credentials: 'include',
    headers: {
      ...(otherOptions.headers || {}),
      Cookie: cookie,
    },
  }
  const res = await fetch(url, newOptions)

  if (res.headers.has('set-cookie')) {
    const cookieStr = parseCookie(res.headers.get('set-cookie'))

    const keys = ['JSESSIONID', 'BIGipServerpool_jwctest']

    // if (keys.some((e) => !cookieStr.includes(e))) {
    //   return await fetchWithCookie(url, '', otherOptions)
    // }

    const getCookieRecord = (str) =>
      !!str
        ? Object.fromEntries(
            str.split('; ').map((e) => {
              const [name, value] = e.split('=')
              return [name, value]
            })
          )
        : {}

    const cookieRecord = getCookieRecord(cookie)
    const patch = getCookieRecord(cookieStr)

    const newCookieRecord = Object.assign({}, cookieRecord, patch)

    const finalCookie = map(newCookieRecord, (v, k) => `${k}=${v}`).join('; ')

    console.log({ finalCookie })

    fetchWithCookie(
      'http://csujwc.its.csu.edu.cn/kblogin.jsp?f=3&type=jg',
      finalCookie
    )

    const [finalRes] = await Promise.all([
      fetchWithCookie(url, finalCookie, otherOptions),
      prisma.cookie.create({
        data: { value: finalCookie, date: new Date().toISOString() },
      }),
    ])

    return finalRes
  } else {
    return res
  }
}
