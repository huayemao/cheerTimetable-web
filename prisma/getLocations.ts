import { parseTable } from './util/parseTable'
import qs from 'qs'
import fetch from 'node-fetch'
import { Location } from '@prisma/client'
import { mapKeys, pick } from 'lodash'
import { COOKIE } from '../constants'
import { HEADERS } from './util/header'
import prisma from '../lib/prisma'
import LOCATIONS from '../_data/locations.json'

const mapping = {
  教室编号: 'id',
  教室类型: 'category',
  座位数: 'seatCount',
  有效座位: 'availableSeatCount',
  考试座位数: 'examSeatCount',
  所在校区: 'campus',
  所在教学楼: 'building',
  教室名称: 'name',
}

const extractorMapping = {
  座位数: (e) => parseInt(e.textContent),
  有效座位: (e) => parseInt(e.textContent),
  考试座位数: (e) => parseInt(e.textContent),
}

const parseLocation = (obj): Location => {
  const newObj = mapKeys(obj, (v, k) => mapping[k])

  // return obj
  return pick(newObj, Object.values(mapping))
}

const fieldExtractorMapping = {
  序号: (e) => parseInt(e.textContent.trim(), 10),
}

// 不用改，将来再 upsert 好了
export async function checkInvalidLocations() {
  const { id } =
    (await prisma.location.findFirst({
      select: {
        id: true,
      },
      where: {
        name: {
          equals: LOCATIONS.find((e) => e.jsid === '4080282')?.jsmc.trim(),
        },
      },
    })) || {}

  if (id) {
    await prisma.lesson.updateMany({
      where: {
        locationId: '4080282',
      },
      data: {
        locationId: id,
      },
    })
  }

  const locations = await prisma.location.findMany({ select: { id: true } })
  const locationIds = locations.map((e) => e.id)

  const locationsInLessons = await prisma.lesson.findMany({
    select: {
      locationId: true,
    },
  })
  const locationsInLessonIds = locationsInLessons.map((e) => e.locationId)
  const nonValidIds = locationsInLessonIds.filter(
    (e) => !locationIds.includes(e)
  )
  console.log(Array.from(new Set(nonValidIds)))
}

export async function getLocationNameAndIds() {
  return await prisma.location.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export async function getLocations(pageNum, pageSize = '10') {
  const url =
    'http://csujwc.its.csu.edu.cn/common/jx0601_select.jsp?id=&name=&type=0&where='

  const data = qs.stringify({
    searchName: '',
    searchJsfh: 'like',
    searchVal: '',
    OrderField: null,
    OrderTpye: 'asc',
    pageSize: pageSize,
    PageNum: pageNum,
    oPageSize: pageSize,
    isOutJoin: false,
    isSql: true,
    tableFields:
      '教室编号:1:1:150:jsh,教室名称:2:1:150:jsmc,教室类型:3:1:100:gnqmc,座位数:5:1:70:jx0601.zws,有效座位:4:1:70:yxzws,考试座位数:6:1:70:jx0601.kszws,所在校区:7:1:100:xx0103.xqmc,所在教学楼:8:1:100:zc0201.jzwmc',
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

  return list.map(parseLocation)
}
