import _ from 'lodash'
import qs from 'qs'
import { retryWithLogin } from '../../utils'
import { parseCookie } from '../../utils/retryWithLogin'
import parseTable from '../parseTable'

const { map, mapKeys } = _

let c =
  'JSESSIONID=E70B83C3AD18E9ED45ACFB7694435B87; BIGipServerpool_jwctest=2051524042.20480.0000'

export async function getTimeTable(type, id, term = '2021-2022-2') {
  const queryObj = {
    xs0101id: '',
    jg0101id: '',
    jx0601id: '',
    xnxq01id: '',
  }

  const mapping = {
    student: 'xs0101id',
    teacher: 'jg0101id',
    location: 'jx0601id',
  }

  const typeKey = mapping[type] || 'xs0101id'

  const query = qs.stringify(
    Object.assign({}, queryObj, { [typeKey]: id, xnxq01id: term })
  )

  const url = `http://csujwc.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_list.jsp?kbtype=xs0101&isview=0&${query}`

  function fetchWithCookie(cookie) {
    return fetch(url, {
      credentials: 'include',
      headers: {
        Cookie: cookie,
      },
    })
  }

  let html

  const res = await fetchWithCookie(c)
  if (res.headers.has('set-cookie')) {
    const cookieStr = parseCookie(res.headers.get('set-cookie'))
    c = cookieStr

    await fetch('http://csujwc.its.csu.edu.cn/kblogin.jsp?f=3&type=jg', {
      credentials: 'include',
      headers: {
        Cookie: cookieStr,
      },
    })

    html = await (await fetchWithCookie(c)).text()
  } else {
    html = await res.text()
  }

  const mappingFn = {
    上课地点: (e) =>
      e.innerHTML.match(/jx0601id=(\w*)\'/)[1] + ',' + e.textContent,
    授课教师: (e) =>
      e.innerHTML.match(/jg0101id=(.*)\'/)[1] + ',' + e.textContent,
  }

  const data = parseTable(html, mappingFn)
  return { courses: data, rawUrl: url }
}
