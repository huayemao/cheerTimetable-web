import _ from 'lodash'
import fetch from 'node-fetch'
import qs from 'qs'
import { HEADERS } from '../util/header'
import { parseTable } from '../util/parseTable'

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

export type LessonRes = {
  序号: string
  上课班级: string
  排课人数: string
  开课编号: string
  开课课程: string
  授课教师: string
  教师院系: string
  开课时间: string
  上课地点: string | null
  上课周次: string
  单双周: string
  分组名: string
  实践学时: string
  上机学时: string
  实验学时: string
  见习学时: string
  讲课学时: string
  操作: string
}

export async function getLessonsById(type, id, term = '') {
  const queryObj = {
    xs0101id: '',
    jg0101id: '',
    jx0601id: '',
    xnxq01id: '',
  }

  const mapping = {
    student: 'xs0101id',
    teacher: 'jg0101id',
    location: 'jx0601id',
    course: 'jx02id',
  }

  const typeKey = mapping[type] || 'xs0101id'

  const data = qs.stringify(
    Object.assign({}, queryObj, {
      [typeKey]: id,
      xnxq01id: term,
      pageSize: '2000',
    })
  )
  const fieldExtractorMapping = {
    上课地点: (e) => {
      const id = e.innerHTML.match(/jx0601id=(\w*)\'/)?.[1]
      return id && id !== 'null' ? id + ',' + e.textContent.trim() : null
    },
    授课教师: (e) => {
      const id = e.innerHTML.match(/jg0101id=(.*)\'/)?.[1]
      return id && id !== 'null' ? id + ',' + e.textContent.trim() : null
    },
  }

  const url = `http://jwctest.its.csu.edu.cn/jiaowu/pkgl/llsykb/llsykb_list.jsp?kbtype=xs0101&isview=0`

  const requestOptions = {
    method: 'POST',
    headers: HEADERS,
    body: data,
  }

  const res = await fetch(url, requestOptions)
  const html = await res.text()
  const list = parseTable<any>(html, fieldExtractorMapping)

  return list as LessonRes[]
}
