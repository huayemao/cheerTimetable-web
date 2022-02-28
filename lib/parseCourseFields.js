import TEACHERS from '_data/teachers.json'
import { getNameById } from 'lib/api/getMeta'

export const parseTime = (str) => {
  const day = parseInt(str[0], 10)
  const start = parseInt(str.slice(1, 3), 10)
  const end = parseInt(str.slice(3, 5), 10)
  return {
    day,
    start,
    end,
  }
}

export const parseLocation = (str = '') => {
  const [id, title] = str.split(',')
  return { id, title }
}

export const parseTeacher = (str = '') => {
  if (!str) return []
  const ids = str.split(',').filter((e) => /\w+/.test(e))
  return ids.map((id) => {
    const title = getNameById('teacher', id).replace(/\[.*\]/, '')
    return { id, title }
  })
}
