import _ from 'lodash'
import qs from 'qs'
import { JSDOM } from 'jsdom'
import perseTable from '../parseTable'
import { retryWithLogin } from '../../utils'
import { parseCookie } from '../../utils/retryWithLogin'

var myHeaders = {
  Connection: 'keep-alive',
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  Origin: 'http://csujwc.its.csu.edu.cn',
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  Referer:
    'http://csujwc.its.csu.edu.cn/common/xs0101_select.jsp?id=xs0101id&name=xs0101xm&type=1&where=',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  Cookie:
    'BIGipServerpool_jwctest=2017969610.20480.0000; JSESSIONID=2286A73456EE436777CD46D01C8BAFA5',
}

const { map, mapKeys } = _

let c =
  'JSESSIONID=E70B83C3AD18E9ED45ACFB7694435B87; BIGipServerpool_jwctest=2051524042.20480.0000'

export async function getFieldDetail(name, type) {
  const url = `http://csujwc.its.csu.edu.cn/common/xs0101_select.jsp?id=xs0101id&name=xs0101xm&type=1&where=`

  const data = qs.stringify({
    searchName: 'xm',
    searchJsfh: 'like',
    searchVal: name,
    OrderField: 'null',
    OrderTpye: 'asc',
    dataTotal: '124001',
    pageSize: '10',
    PageNum: '1',
    totalPages: '12401',
    oPageSize: '10',
    scrollx: 'false',
    where1: 'null',
    where2: 'null',
    OrderBy: '',
    isOutJoin: 'false',
    sqlArgs: '',
    isSql: 'true',
    beanName: '',
    tableFields:
      '单位名称:1:1:130:dwmc,专业名称:2:1:130:zymc,年级:3:1:50:ksnd,班级:6:1:90:z.bj,学号:4:1:90:xh,姓名:5:1:80:xm,性别:7:1:40:xb',
    otherFields: '',
  })

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    // redirect: 'follow',
  }

  function fetchWithCookie(cookie) {
    const newHeaders = { ...requestOptions.headers, Cookie: cookie }
    const options = Object.assign({}, requestOptions, {
      credentials: 'include',
      headers: newHeaders,
    })

    return fetch(url, options)
  }

  let html

  const res = await fetchWithCookie(c)

  // 问题：有 cookie 的情况下是否回犯浑 set-cookie
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

  const obj = perseTable(html)

  return obj
}
