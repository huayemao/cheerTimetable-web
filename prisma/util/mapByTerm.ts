import { isArray } from 'lodash'
import { TERMS } from '../../constants'

// 为列表中的每个值添加 term 属性
export const mapByTerms = async (fn, terms = TERMS) =>
  (
    await Promise.all(
      terms.map(async (term) => {
        const res = await fn(term)
        return isArray(res) ? res.map((e) => ({ ...e, term })) : res
      })
    )
  ).flat()
