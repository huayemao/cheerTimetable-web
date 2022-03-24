import _ from 'lodash'
import fetch from 'node-fetch'
import qs from 'qs'
import { Student } from 'prisma/prisma-client'
import { parseTable } from '../util/parseTable'
import { COOKIE } from '../../constants'
import prisma from '../../lib/prisma'
import { HEADERS } from '../util/header'

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

const myHeaders = HEADERS

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
