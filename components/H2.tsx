import React from 'react'
import s from './Content.module.css'

export function H2({ title, children }) {
  return (
    <details
      className={
        'relative m-2 mx-auto space-y-2  rounded-lg py-4 px-8 marker:mr-6  marker:text-slate-600 open:bg-white ' +
        s.card
      }
      open
    >
      <summary className="relative z-[1] select-none text-sm font-semibold leading-6 text-slate-800 dark:text-white">
        <h2 className=" inline-block text-xl font-semibold text-gray-900 ">
          {title}
        </h2>
      </summary>
      <div>{children}</div>
    </details>
  )
}
