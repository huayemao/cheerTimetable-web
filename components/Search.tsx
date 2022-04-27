import React, {
  ChangeEventHandler,
  FormEventHandler,
  isValidElement,
  KeyboardEventHandler,
  memo,
  ReactElement,
  useCallback,
} from 'react'
import { noop } from 'lodash'
import { Tooltip } from './common/Tooltip'
import Link from 'next/link'
import { SearchIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import className from 'clsx'

type Props = {
  onChange?: (v: string) => void
  onSubmit?: (v: string) => void
  placeholder?: string
  defaultValue?: string
  dropDownBtn?: ReactElement | null
}

function Search({
  onChange = noop,
  onSubmit = noop,
  placeholder = '',
  defaultValue = '',
  dropDownBtn = null,
}: Props) {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => onChange(e.target.value),
    [onChange]
  )
  const handleSubmit = useCallback<FormEventHandler<HTMLInputElement>>(
    (e) => {
      onSubmit(e.currentTarget.value)
    },
    [onSubmit]
  )

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === 'Enter') {
        onSubmit(e.currentTarget.value)
      }
    },
    [onSubmit]
  )

  return (
    <div id="search" className="dropdown relative inline-block text-left">
      {dropDownBtn}
      <input
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        className={className(
          'w-64 rounded-l-xl rounded-t-xl border border-slate-200 bg-slate-200 p-2  focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-72',
          {
            'pl-16': isValidElement(dropDownBtn),
          }
        )}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength={32}
        type="text"
        enterKeyHint="go"
      />
      <SearchIcon className="absolute right-2  top-2.5 h-6 w-6 text-slate-400"></SearchIcon>
    </div>
  )
}

export default memo(Search)
