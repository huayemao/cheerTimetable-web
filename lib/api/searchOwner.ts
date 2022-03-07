import _ from 'lodash'
import qs from 'qs'
import perseTable from '../parseTable'
import { OwnerType } from 'lib/types/Owner'
import fetchWithCookie, { retrieveCookie } from '../fetchWithCookie'
import prisma from 'lib/prisma'

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
}

const { map, mapKeys } = _

const mapping = {
  [OwnerType.student]: 'xs0101',
  [OwnerType.teacher]: 'jg0101',
  [OwnerType.location]: 'js',
}

export async function searchOwnerR(name, type) {
  const c = await retrieveCookie()
  const url = `http://csujwc.its.csu.edu.cn/common/xs0101_select.jsp?id=xs0101id&type=1&where=`

  const data = qs.stringify({
    searchName: 'xm',
    // searchJsfh: 'like',
    searchJsfh: '=',
    searchVal: name,
    OrderField: 'ksnd',
    OrderTpye: 'desc',
    pageSize: '40',
    PageNum: '1',
    totalPages: '12401',
    oPageSize: '40',
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
    // redirect: 'follow',
  }

  const res = await fetchWithCookie(url, c, requestOptions)

  const html = await res.text()

  const obj = perseTable(html)

  return obj
}

export async function searchOwner(name, type) {
  return await prisma.student.findMany({
    where: { name: { contains: name } },
    orderBy: { grade: 'desc' },
  })
}
