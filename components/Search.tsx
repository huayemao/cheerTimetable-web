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
import { SearchIcon } from '@heroicons/react/outline'
import clsx from 'clsx'

type Props = {
  onChange?: (v: string) => void
  onSubmit?: (v: string) => void
  placeholder?: string
  defaultValue?: string
  dropDownBtn?: ReactElement | null
  className?: string
  iconClassName?: string
}

function Search({
  onChange = noop,
  onSubmit = noop,
  placeholder = '',
  defaultValue = '',
  dropDownBtn = null,
  className = '',
  iconClassName = '',
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
    <div id="search" className={'dropdown relative inline-block '}>
      {dropDownBtn}
      <input
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyPress={handleKeyDown}
        onSubmit={handleSubmit}
        className={clsx(
          'p-2 focus:border-transparent focus:outline-none focus:ring-2',
          {
            'pl-16': isValidElement(dropDownBtn),
            [className]: true,
            // [presetInputClassNames]: true,
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
      <SearchIcon
        className={clsx('absolute right-2  top-2.5 h-6 w-6', {
          [iconClassName]: true,
        })}
      ></SearchIcon>
    </div>
  )
}

export default memo(Search)
