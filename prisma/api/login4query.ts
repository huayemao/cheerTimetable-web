import fetch from 'node-fetch'
import { BaseURL, HEADERS } from '../util/header'

const href = encodeURI(`http://csujwc.its.csu.edu.cn/kblogin.jsp?f=3&type=js&accountType=1&xsorjsid=0a9&time=2025-09-10 14:21:31&verify=fd77b155f611a5046b4a090d89523848`)

export async function login4query() {
  console.log('Logging in for query...')
  const res = await fetch(
    `${BaseURL}/kblogin.jsp?f=3&type=jg`,
    {
      headers: HEADERS,
    }
  )
  const text = await res.text();
  if (text.includes("/jiaowu/pkgl/llsykb/llsykb_list.jsp?init")) {
    console.log("successed to login!")
  }
  else {
    throw Error("failed to login, html: " + text)
  }
}
