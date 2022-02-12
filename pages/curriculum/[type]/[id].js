import { JSDOM } from 'jsdom'
import { mapKeys } from 'lodash'
import qs from 'qs'
import { retryWithLogin } from '../../../utils'
import { Timetable } from '../../../components/Timetable'
import useMediaQuery from '../../../hooks/useMediaQuery '

export default function ({ data }) {
  const show7days = useMediaQuery('(min-width: 768px)', true, false)
  return <Timetable data={data} show7days={show7days}></Timetable>
}

export async function getStaticProps(context) {
  const { id, type } = context.params

  const obj = {
    xs0101id: '',
    jg0101id: '',
    jx0601id: '',
    xnxq01id: '2021-2022-1',
  }

  const mapping = {
    student: 'xs0101id',
    teacher: 'jg0101id',
    location: 'jx0601id',
  }

  const key = mapping[type] || 'xs0101id'

  const str = qs.stringify(Object.assign({}, obj, { [key]: id }))

  function fetchWithCookie(cookie) {
    return fetch(
      `http://csujwc.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_list.jsp?kbtype=xs0101&isview=0&${str}`,
      {
        credentials: 'include',
        headers: {
          Cookie: cookie,
        },
      }
    )
  }

  const html = await retryWithLogin(fetchWithCookie).then((e) => e.text())
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

  return {
    props: {
      data,
      rawUrl: `http://csujwc.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_list.jsp?kbtype=xs0101&isview=0&${str}`,
    },
    revalidate: 60 * 60 * 24,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      id: '8305180722',
      type: 'student',
    },
    {
      id: '8305180701',
      type: 'student',
    },
    {
      id: '8305180702',
      type: 'student',
    },
    {
      id: '8305180703',
      type: 'student',
    },
    {
      id: '8305180704',
      type: 'student',
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: 'blocking' }
}
