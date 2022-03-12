import { TERMS } from '../constants'
import STUDENTS from '../_data/students.json'

const date = new Date()

export function parseGrade(id) {
  const grade = Number(id.slice(-6, -4))
  return grade > 10 && grade < 25 ? grade : null
}

export const getTermsByStudent = (id) => {
  const grade = id.slice(-6, -4)
  const year = String(date.getFullYear()).slice(2)

  if (!!grade && grade > '10' && grade < year) {
    const fullGrade = '20' + grade
    const yearNum = parseInt(fullGrade, 10)
    const startTerm = `${yearNum}-${yearNum + 1}-1`
    const endTerm = `${yearNum + 3}-${yearNum + 3 + 1}-2`
    const startIndex = TERMS.indexOf(startTerm)
    const endIndex = TERMS.indexOf(endTerm)

    // TERMS 按时间倒序
    return TERMS.slice(endIndex === -1 ? 0 : endIndex, startIndex + 1)
  } else {
    return TERMS
  }
}
