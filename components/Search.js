import React from 'react'
import { noop } from 'lodash'
import { Search as IconSearch } from 'components/Icons'

export default function Search({
  onChange = noop,
  onSubmit = noop,
  placeholder = '',
  defaultValue = '',
}) {
  return (
    <div id="search" className="dropdown relative inline-block text-left">
      <IconSearch className="absolute left-3.5 top-2.5 h-6 w-6 text-gray-500"></IconSearch>
      <input
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (event.keyCode == '13') {
            onSubmit(e.target.value)
          }
        }}
        onSubmit={(e) => {
          onSubmit(e.target.value)
        }}
        className="w-64 rounded-l-xl rounded-t-xl border border-slate-200 bg-slate-200 p-2 pl-11 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-72"
        placeholder={placeholder}
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
