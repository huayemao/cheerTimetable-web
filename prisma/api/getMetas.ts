import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import TERMS from '../../constants/terms'
import { BaseURL, HEADERS } from '../util/header'

export const getStudentMeta = async (term) => {
  const html = await (
    await fetch(
      `${BaseURL}/jiaowu/pkgl/llsykb/llsykb_find_xs0101.jsp?xnxq01id=${term}&init=1&isview=0`,
      { headers: HEADERS }
    )
  ).text()
  const doc = new JSDOM(html).window.document
  return eval(
    doc
      .querySelector('body > script:nth-child(4)')
      .textContent.match(/\[.*]/)[0]
  )
}

export const getLocationMeta = async (term) => {
  const text = await (
    await fetch(
      `${BaseURL}/kkglAction.do?method=queryjs&xnxqh=${term}`,
      {
        headers: HEADERS,
      }
    )
  ).text()
  return eval(text.match(/\[.*]/)[0])
}

export const getCourseMeta = async (term) => {
  const text = await (
    await fetch(
      `http://csujwc.its.csu.edu.cn/tkglAction.do?method=querykc&xnxqh=${term}`,
      {
        headers: HEADERS,
      }
    )
  ).text()

  try {
    return eval(text.match(/\[.*]/)[0])
  } catch (error) {
    console.error("failed to get course meta" + text)
    throw (error)
  }
}

export const getTeacherMeta = async (term) => {
  const text = await (
    await fetch(
      `http://csujwc.its.csu.edu.cn/tkglAction.do?method=queryjg0101&xnxqh=${term}`,
      {
        headers: HEADERS,
      }
    )
  ).text()
  return eval(text.match(/\[.*]/)[0])
}

// 获取开学时间映射
// todo: 这个没有用了，两套环境 cookie 不同，每年手动去写吧
const getDateMapping = async () => {
  const resluts = await Promise.all(
    TERMS.map(async (term) => {
      const res = await fetch(
        'http://csujwc.its.csu.edu.cn/jsxsd/jskb/jskb_list.do?Ves632DSdyV=NEW_JSD_WDKB',
        {
          headers: HEADERS,
          referrer:
            'http://csujwc.its.csu.edu.cn/jsxsd/jskb/jskb_list.do?Ves632DSdyV=NEW_JSD_WDKB',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: `cj0701id=&zc=&demo=&xnxq01id=${term}&sfFD=1`,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        }
      )
      const html = await res.text()
      const doc = new JSDOM(html).window.document
      const textContent =
        doc.querySelector(
          '#kbtable > tbody > tr:nth-child(1) > td:nth-child(1)'
        )?.textContent || ''
      return textContent?.split('日')[0]
    })
  )

  const mapping = Object.fromEntries(TERMS.map((e, i) => [e, resluts[i]]))
  return mapping
}
