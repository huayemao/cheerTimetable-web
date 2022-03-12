const CURRICULUM_TYPES = {
  student: 'student',
  teacher: 'teacher',
  location: 'location',
}

const baseTerms = (() => {
  const DATE = new Date()
  const curYear = DATE.getFullYear()
  const curMonth = DATE.getMonth() + 1
  const shouldShowNextYear = curMonth > 6
  return Array.from(
    { length: curYear - 2016 + 1 },
    (e, i) => curYear - i
  ).flatMap((e) => {
    if (e === curYear) {
      return shouldShowNextYear ? [`${e}-${e + 1}-1`] : []
    }
    return [`${e}-${e + 1}-2`, `${e}-${e + 1}-1`]
  })
})()

export default baseTerms
