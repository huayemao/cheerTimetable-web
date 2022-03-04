import _ from 'lodash'
import qs from 'qs'
import parseTable from '../parseTable'
import { COOKIE } from 'constants'
import fetchWithCookie, { retrieveCookie } from '../fetchWithCookie.js'

const { map, mapKeys } = _

export async function getTimeTable(type, id, term = '2021-2022-2') {
  const c = await retrieveCookie()

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

  const res = await fetchWithCookie(url, c)
  const html = await res.text()

  const fieldExtractorMapping = {
    上课地点: (e) =>
      e.innerHTML.match(/jx0601id=(\w*)\'/)[1] + ',' + e.textContent,
    授课教师: (e) =>
      e.innerHTML.match(/jg0101id=(.*)\'/)[1] + ',' + e.textContent,
  }

  const data = parseTable(html, fieldExtractorMapping)
  return { courses: data, rawUrl: url }
}
