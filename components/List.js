import { map } from 'lodash'
import React from 'react'

export default function List({ data }) {
  const rowClass =
    'flex flex-col sm:flex-row justify-between items-center sm:items-start py-3 border-t border-gray-300 last:border-none'
  const leftClass = 'w-full sm:w-1/3 font-medium text-center sm:text-left'
  const rightClass = 'flex-1 text-center sm:text-left'

  return (
    <ul className="w-full">
      {map(data, (v, k) => (
        <li key={`${k}_${v}`}>
          <span>{k}</span>：{v}
        </li>
      ))}
    </ul>
  )
}
