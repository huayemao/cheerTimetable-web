import _ from 'lodash'
import fetch from 'node-fetch'
import qs from 'qs'
import { JSDOM } from 'jsdom'
import { Student } from 'prisma/prisma-client'

// const _ = require('lodash')
// const fetch = require('node-fetch')
// const qs = require('qs')
// const { JSDOM } = require('jsdom')

const { map, mapKeys, mapValues } = _

const mapping = {
  序号: 'seq',
  单位名称: 'facultyName',
  专业名称: 'professionName',
  年级: 'grade',
  班级: 'className',
  学号: 'id',
  姓名: 'name',
  性别: 'sex',
}

function parseTable(html, fieldExtractorMapping = {}) {
  const doc = new JSDOM(html)
  const table = doc.window.document.querySelector('#dataTables')
  const rows = [...table.rows]
  const ths = [...rows[0].cells].map((e) => e.innerHTML)

  const data = rows.slice(1).map((row) => {
    const cells = [...row.cells]

    const obj = {
      ...cells.map((e, i) => {
        const defaultFn = (e) => e.textContent
        const fn = fieldExtractorMapping[ths[i]] || defaultFn
        return fn(e)
      }),
    }
    const res = mapKeys(obj, (v, k) => mapping[ths[k]])
    const student = mapValues(res, (v, k) =>
      k === 'seq' ? parseInt(v, 10) : v
    )
    return student as Student
  })
  return data
}

const myHeaders = {
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
    'JSESSIONID=EF987E4182496DE8EB2C354BCDD078FE; BIGipServerpool_jwctest=2085078474.20480.0000',
}

export async function getData(pageNum, pageSize = '10') {
  const url = `http://csujwc.its.csu.edu.cn/common/xs0101_select.jsp?id=xs0101id&type=1&where=`

  const data = qs.stringify({
    searchName: 'xm',
    searchJsfh: 'like',
    searchVal: '',
    OrderField: 'ksnd',
    OrderTpye: 'desc',
    pageSize: pageSize,
    PageNum: pageNum,
    oPageSize: pageSize,
    scrollx: 'false',
    where1: 'null',
    where2: 'null',
    OrderBy: 'ksnd desc',
    isOutJoin: 'false',
    sqlArgs: '',
    isSql: 'true',
    beanName: '',
    tableFields:
      '单位名称:1:1:130:dwmc,专业名称:2:1:130:zymc,年级:3:1:50:ksnd,班级:6:1:90:z.bj,学号:4:1:90:xh,姓名:5:1:80:xm,性别:7:1:40:xb',
    otherFields: '',
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
  }

  const res = await fetch(url, requestOptions)

  const html = await res.text()

  const list = parseTable(html)

  return list
}
