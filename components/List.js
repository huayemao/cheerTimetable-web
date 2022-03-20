import { map } from 'lodash'
import React from 'react'

export default function List({ data, renderListItem, className = '' }) {
  return (
    <ul
      className={
        'divide-y lg:divide-y-0 lg:grid grid-cols-2 gap-x-4 gap-y-1 self-stretch p-2 lg:p-4 text-gray-900 ' +
        className
      }
    >
      {data.map((e, i) => (
        <li
          className="relative py-2 px-4 lg:px-10 font-light  hover:bg-blue-50 hover:text-blue-500"
          key={e.id}
        >
          {renderListItem(e, i)}
        </li>
      ))}
    </ul>
  )
}
