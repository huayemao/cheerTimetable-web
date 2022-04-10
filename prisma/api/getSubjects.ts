import { parseTable } from '../util/parseTable'
import qs from 'qs'
import fetch from 'node-fetch'
import { Subject } from '@prisma/client'
import { mapKeys, pick } from 'lodash'
import { COOKIE } from '../../constants'
import { HEADERS } from '../util/header'

const mapping = {
  课程号: 'id',
  课程名称: 'name',
  学分: 'credit',
  总学时: 'tuitionHour',
  课程类别: 'category',
  开课单位: 'department',
  年级: 'grade',
  班级: 'className',
  学号: 'id',
}

const extractorMapping = {
  学分: (e) => parseInt(e.textContent),
  总学时: (e) => parseInt(e.textContent),
}

const parseSubject = (obj): Subject => {
  const newObj = mapKeys(obj, (v, k) => mapping[k])
  const { 讲课学时, 实践学时, 上机学时, 实验学时, 见习学时 } = obj
  const tuitionHourDetail = [讲课学时, 实践学时, 上机学时, 实验学时, 见习学时]
    .map((e) => parseInt(e || '0'))
    .join('-')

  return pick(
    {
      ...newObj,
      tuitionHourDetail,
    },
    Object.values(mapping).concat('tuitionHourDetail')
  )
}

export async function getSubjects(pageNum, pageSize = '10', version) {
  const url =
    'http://csujwc.its.csu.edu.cn/common/kcxxNew_select.jsp?id=undefined&name=undefined&kch=2-105&type=0&where='

  const data = qs.stringify({
    searchName: 'kch',
    searchJsfh: 'like',
    searchVal: '',
    OrderField: 'kch',
    OrderTpye: 'desc',
    pageSize: pageSize,
    PageNum: pageNum,
    oPageSize: pageSize,
    ndbbsel: version,
    version: version,
    isOutJoin: false,
    isSql: true,
    tableFields:
      '课程号:1:1:100:t.kch,课程名称:2:1:140:t.kcmc,学分:5:1:40:t.xf,总学时:6:1:60:t.zxs,课程类别:8:1:120:t.ztkclb,开课单位:3:1:140:t.xx0301dwmc,讲课学时:11:1:80:t.xs0,实践学时:12:1:80:t.xs1,上机学时:13:1:80:t.xs2,实验学时:14:1:80:t.xs3,见习学时:15:1:80:t.xs4,',
    otherFields: '',
  })

  const requestOptions = {
    method: 'POST',
    headers: HEADERS,
    body: data,
  }

  const res = await fetch(url, requestOptions)
  const html = await res.text()
  const list = parseTable<any>(html, extractorMapping)

  return list.map(parseSubject)
}
