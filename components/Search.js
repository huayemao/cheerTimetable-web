import React from 'react'
import { noop } from 'lodash'
import { Search as IconSearch } from 'components/Icons'

export default function Search({ onChange = noop, onSubmit = noop }) {
  return (
    <div id="search" className="dropdown relative inline-block text-left">
      <IconSearch className="absolute left-3.5 top-2.5 h-6 w-6 text-slate-500 dark:text-slate-300"></IconSearch>
      <input
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (event.keyCode == '13') {
            onSubmit(e.target.value)
          }
        }}
        onSubmit={(e) => {
          onSubmit(e.target.value)
        }}
        className="rounded-l-xl rounded-t-xl border border-slate-200 bg-slate-200 p-2 pl-11 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
        placeholder="输入学生姓名"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength="32"
        type="text"
        enterKeyHint="go"
      />
    </div>
  )
}
