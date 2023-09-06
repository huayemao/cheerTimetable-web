import clsx from 'clsx'
import React from 'react'
import s from './Content.module.css'

export function H2({
  title,
  children,
  close = false,
  slate = false,
  simple = false,
  className = '',
}) {
  const containerClassNames = 'mx-auto space-y-2 px-4 py-3 md:m-2 md:px-8'
  const titleClassNames =
    'inline-block text-lg font-semibold text-gray-900 md:text-xl leading-6 text-slate-800 dark:text-white'

  if (simple) {
    return (
      <div className={containerClassNames}>
        <h2 className={titleClassNames}>{title}</h2>
        {children}
      </div>
    )
  }

  return (
    <details
      className={clsx(
        containerClassNames,
        'relative  rounded-lg  open:py-4 marker:mr-6 marker:text-slate-600 ',
        {
          'open:bg-white': !slate,
          [s.card]: !slate,
        },
        className
      )}
      open={!close}
    >
      <summary className="relative z-[1] select-none">
        <h2 className={titleClassNames}>{title}</h2>
      </summary>
      <div>{children}</div>
    </details>
  )
}
