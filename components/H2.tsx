import React, { useState } from 'react'
import s from './Content.module.css'
import clsx from 'clsx'
import Head from 'next/head'

export function H2({
  title,
  children,
  close = false,
  slate = false,
  className = '',
}) {
  return (
    <details
      className={clsx(
        'relative mx-auto space-y-2 rounded-lg px-4 py-3 open:py-4 marker:mr-6 marker:text-slate-600 md:m-2 md:px-8 ',
        {
          'open:bg-white': !slate,
          [s.card]: !slate,
        },
        className
      )}
      open={!close}
    >
      <summary className="relative z-[1] select-none text-sm font-semibold leading-6 text-slate-800 dark:text-white">
        <h2 className="inline-block text-lg font-semibold text-gray-900 md:text-xl ">
          {title}
        </h2>
      </summary>
      <div>{children}</div>
    </details>
  )
}
