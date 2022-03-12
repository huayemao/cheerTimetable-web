import { JSDOM } from 'jsdom'
import { mapKeys } from 'lodash'

export function parseTable<T>(html, fieldExtractorMapping = {}, mapping = {}) {
  const doc = new JSDOM(html)
  const table = doc.window.document.querySelector('#dataTables')
  const rows = [...table.rows]
  const ths = [...rows[0].cells].map((e) => e.innerHTML)

  const data = rows.slice(1).map((row) => {
    const cells = [...row.cells]

    const obj = {
      ...cells.map((e, i) => {
        const defaultFn = (e) => e.textContent.trim()
        const fn = fieldExtractorMapping[ths[i]] || defaultFn
        return fn(e)
      }),
    }
    const item = mapKeys(obj, (v, k) => mapping[ths[k]] || ths[k])
    return item as T
  })
  return data
}

export function parseHTML(html) {
  const doc = new JSDOM(html)
  return doc.window.document
}
