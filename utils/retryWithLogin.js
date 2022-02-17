import { toughCookie } from 'jsdom'

export function parseCookie(str) {
  return str
    .split(',')
    .map((e) => toughCookie.parse(e).cookieString())
    .join('; ')
}

export default async function retryWithLogin(fn) {
  const res = await fn()
  if (res.headers.has('set-cookie')) {
    const cookieStr = parseCookie(res.headers.get('set-cookie'))

    await fetch('http://csujwc.its.csu.edu.cn/kblogin.jsp?f=3&type=jg', {
      credentials: 'include',
      headers: {
        Cookie: cookieStr,
      },
    })
    return await fn(cookieStr)
  }
}
