import { JSDOM } from 'jsdom'
import { mapKeys } from 'lodash'

export default function (html, mappingFn = {}) {
  const doc = new JSDOM(html)
  const table = doc.window.document.querySelector('#dataTables')
  const rows = [...table.rows]
  const ths = [...rows[0].cells].map((e) => e.innerHTML)

  const data = rows.slice(1).map((row) => {
    const cells = [...row.cells]

    const obj = {
      ...cells.map((e, i) => {
        const defaultFn = (e) => e.textContent
        const fn = mappingFn[ths[i]] || defaultFn
        return fn(e)
      }),
    }
    return mapKeys(obj, (v, k) => ths[k])
  })
  return data
}
