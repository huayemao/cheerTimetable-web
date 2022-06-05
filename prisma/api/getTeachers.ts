import _ from 'lodash'
import fetch from 'node-fetch'
import qs from 'qs'
import { Teacher } from 'prisma/prisma-client'
import { parseTable } from '../util/parseTable'
import { COOKIE } from '../../constants'
import { HEADERS } from '../util/header'

const { map, mapKeys, mapValues, pick } = _

const mapping = {
  教工号: 'id',
  姓名: 'name',
  职称: 'title',
  所属单位: 'facultyName',
  学历: 'eduBackground',
}

const parseTeacher = (obj): Teacher => {
  const newObj = mapKeys(obj, (v, k) => mapping[k])
  return pick(newObj, Object.values(mapping)) as Teacher
}

export async function getTeachers(pageNum, pageSize = '1000') {
  const url = `http://csujwc.its.csu.edu.cn/common/jg0101_select.jsp?id=jg0101id&type=1&where=`

  const data = qs.stringify({
    searchName: 'XM',
    searchJsfh: 'like',
    searchVal: '',
    OrderField: 'JGH',
    OrderTpye: 'asc',
    pageSize: pageSize,
    PageNum: pageNum,
    oPageSize: pageSize,
    scrollx: 'true',
    where1: 'null',
    where2: 'null',
    OrderBy: 'JGH asc',
    isOutJoin: 'false',
    sqlArgs: '',
    isSql: 'true',
    beanName: '',
    tableFields:
      '姓名:2:1:100:XM,教工号:1:1:100:JGH,所属单位:3:1:150:dwmc,所属教研室:4:1:150:ssjys,职称:8:1:100:zw,学历:9:1:100:xl',
    otherFields: '',
  })

  const requestOptions = {
    method: 'POST',
    headers: HEADERS,
    body: data,
  }

  const res = await fetch(url, requestOptions)
  const html = await res.text()
  const list = parseTable<Teacher>(html)

  return list.map(parseTeacher)
}
