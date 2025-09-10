import { JSDOM } from 'jsdom'
import { mapKeys } from 'lodash'

export function parseTable<T>(html, fieldExtractorMapping = {}, mapping = {}) {
  const doc = new JSDOM(html)
  const table = doc.window.document.querySelector('#dataTables')
  if (!table) {
    const html = doc.window.document.body.innerHTML
    const failFlags = ["没有访问该功能的权限", "未登录"]
    const rateLimitFlags = ["jx02id", "课表数据列表"];
    const uncertainFlags = ["权限认证错误"]
    if (failFlags.some((text) => html.includes(text))) {
      throw new Error("认证失败，html: " + doc.window.document.body.innerHTML)
    }
    else if (rateLimitFlags.some((text) => html.includes(text))) {
      throw new Error('响应错误，请求频率太快，建议重试，html：' + doc.window.document.body.innerHTML, { cause: "RATE_LIMIT" })
    }
    else if (uncertainFlags.some((text) => html.includes(text))) {
      throw new Error('响应错误，不确定该不该重试，html：' + doc.window.document.body.innerHTML, { cause: "UNCERTAIN" })
    }
    throw new Error('响应错误，不知道咋了，html：' + doc.window.document.body.innerHTML)
  }
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
