export const parseTime = (str) => {
  const day = parseInt(str[0], 10)
  const start = parseInt(str.slice(1, 3), 10)
  const end = parseInt(str.slice(-2), 10)

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
