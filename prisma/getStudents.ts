import _ from 'lodash'
import fetch from 'node-fetch'
import qs from 'qs'
import { Student } from 'prisma/prisma-client'
import { parseTable } from './util/parseTable'
import { COOKIE } from '../constants'
import prisma from '../lib/prisma'
import STUDENTS from '../_data/students.json'

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

const fieldExtractorMapping = {
  序号: (e) => parseInt(e.textContent.trim(), 10),
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
  Cookie: COOKIE,
}

export async function getStudents(pageNum, pageSize = '10') {
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

  const list = parseTable<Student>(html, fieldExtractorMapping, mapping)

  return list
}

async function getLackedStudents() {
  const students = await prisma.student.findMany({
    select: {
      id: true,
    },
  })
  const studentIds = students.map((e) => e.id)

  const lacked = STUDENTS.filter(
    (e) => !studentIds.includes(e.xh) && e.xh.localeCompare('2014') > 1
  )
  return lacked
}