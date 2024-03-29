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
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

type Props = {
  onChange?: (v: string) => void
  onSubmit?: (v: string) => void
  placeholder?: string
  defaultValue?: string
  dropDownBtn?: ReactElement | null
  className?: string
  iconClassName?: string
  wrapperClassName?: string
}

function Search({
  onChange = noop,
  onSubmit = noop,
  placeholder = '',
  defaultValue = '',
  dropDownBtn = null,
  className = '',
  iconClassName = '',
  wrapperClassName = '',
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
    <div
      id="search"
      className={clsx('dropdown relative inline-block ', wrapperClassName)}
    >
      {dropDownBtn}
      <input
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyPress={handleKeyDown}
        onSubmit={handleSubmit}
        className={clsx(
          'w-full p-2 focus:border-transparent focus:outline-none focus:ring-1',
          {
            'pl-16': isValidElement(dropDownBtn),

            // [presetInputClassNames]: true,
          },
          className
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
      <MagnifyingGlassIcon
        className={clsx('absolute right-2 top-2 h-6 w-6', {
          [iconClassName]: true,
        })}
      />
    </div>
  )
}

export default memo(Search)
