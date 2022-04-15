import { map } from 'lodash'
import React from 'react'
import c from 'clsx'

export default function List({ data, renderListItem, className = '' }) {
  return (
    <ul
      className={c(
        'grid-cols-2 gap-x-4 gap-y-1 divide-y self-stretch text-gray-900 lg:grid  lg:divide-y-0 ',
        className
      )}
    >
      {data.map((e, i) => (
        <li
          className="relative py-2 px-4 font-light hover:bg-blue-50  hover:text-blue-500 lg:px-10"
          key={e.id || String(i)}
        >
          {renderListItem(e, i)}
        </li>
      ))}
    </ul>
  )
}
