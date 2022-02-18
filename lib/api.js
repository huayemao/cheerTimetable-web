import _ from 'lodash'
import qs from 'qs'
import { JSDOM } from 'jsdom'
import { retryWithLogin } from '../utils'
import STUDENTS from '../_data/students.json'
import LOCATIONS from '../_data/locations.json'
import TEACHERS from '../_data/teachers.json'
import { parseCookie } from '../utils/retryWithLogin'

const { map, mapKeys } = _

const FIELDS = {
  student: 'student',
  teacher: 'teacher',
  location: 'location',
}

const FIELDS_CONFIG = {
  [FIELDS.student]: {
    data: STUDENTS,
    getFiledName: 'xs0101id',
    searchFieldName: 'xm',
  },
  [FIELDS.teacher]: {
    data: TEACHERS,
    getFiledName: 'jg0101id',
    searchFieldName: 'jgxm',
  },
  [FIELDS.location]: {
    data: LOCATIONS,
    getFiledName: 'jsid',
    searchFieldName: 'jsmc',
  },
}

export const getNameById = (type, id) => {
  const { data, getFiledName, searchFieldName } = FIELDS_CONFIG[type]
  const obj = data.find((e) => e[getFiledName] === id) || {}
  return obj[searchFieldName] || null
}

export const searchByName = (type, name) => {
  const { data, searchFieldName } = FIELDS_CONFIG[type]
  return data.filter((e) => e[searchFieldName].includes(name))
}

export function searchStudent(name) {
  return STUDENTS.filter((e) => e.xm.includes(name))
}

let c =
  'JSESSIONID=7776BEAC8D4B004552D22C5AD2CBEF26; BIGipServerpool_jwctest=2085078474.20480.0000'

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
    console.log(888888)
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

  const doc = new JSDOM(html)

  const table = doc.window.document.querySelector('#dataTables')

  const rows = [...table.rows]

  const ths = [...rows[0].cells].map((e) => e.innerHTML)

  const fnMapping = {
    上课地点: (e) =>
      e.innerHTML.match(/jx0601id=(\w*)\'/)[1] + ',' + e.textContent,
    授课教师: (e) =>
      e.innerHTML.match(/jg0101id=(.*)\'/)[1] + ',' + e.textContent,
  }

  const data = rows.slice(1).map((row) => {
    const cells = [...row.cells]
    const obj = {
      ...cells.map((e, i) => {
        const defaultFn = (e) => e.textContent
        const fn = fnMapping[ths[i]] || defaultFn
        return fn(e)
      }),
    }
    return mapKeys(obj, (v, k) => ths[k])
  })
  return { data, rawUrl: url }
}
