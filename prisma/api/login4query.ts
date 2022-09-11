import fetch from 'node-fetch'
import { HEADERS } from '../util/header'

export async function login4query() {
  const res = await fetch(
    'http://jwctest.its.csu.edu.cn/kblogin.jsp?f=3&type=jg',
    {
      headers: HEADERS,
    }
  )
//  console.log(await res.text())

}
