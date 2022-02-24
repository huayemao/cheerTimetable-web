import { fields } from '../../constants'

export const getNameById = (type, id) => {
  const { data, getFiledName, searchFieldName } = fields.FIELDS_CONFIG[type]
  const obj = data.find((e) => e[getFiledName] === id) || {}
  return obj[searchFieldName] || null
}

export const searchByName = (type, name) => {
  const { data, searchFieldName } = fields.FIELDS_CONFIG[type]
  return data.filter((e) => e[searchFieldName].includes(name))
}
