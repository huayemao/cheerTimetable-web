import React, { ReactNode, useState, useRef, useCallback } from 'react'
import cn from 'clsx'
import { noop } from 'lodash'
import useClickOutside from 'lib/hooks/useClickOutside'
import useCollapsible from 'lib/hooks/useCollapsible'
import { useDerivedState } from 'lib/hooks/useDerivedState'

type SelectOption = {
  key: string
  label: string
  isActive?: boolean
}

type SelectProps = {
  options: SelectOption[]
  defaultValue?: string
  onChange: (key: string) => void
  renderOption?: (option: SelectOption) => ReactNode
  className?: string
  defaultLabel?: string
}

const defaultOptionRenderer = (e) => e.label

export default function Select({
  options,
  defaultValue = options[0].key,
  onChange = noop,
  renderOption = defaultOptionRenderer,
  className = '',
  defaultLabel = '',
}: SelectProps) {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })
  const [activeKey, setActiveKey] = useDerivedState(defaultValue)

  const label = options.find((e) => e.key === activeKey)?.label || defaultLabel

  const ref = useRef(null)
  useClickOutside(ref, () => {
    !collapsed && toggleCollapsed()
  })

  const handleItemClick = useCallback(
    (option) => {
      setActiveKey(option.key)
      onChange(option.key)
      toggleCollapsed()
    },
    [onChange, setActiveKey, toggleCollapsed]
  )

  return (
    <div ref={ref} className={'relative inline-block w-full ' + className}>
      <span className="rounded-md shadow-sm">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="border-accent-3 bg-accent-0 focus:outline:none flex w-full justify-between rounded-md border px-4 py-3 text-sm leading-5 text-slate-500  duration-150 ease-in-out hover:text-slate-700 focus:border-blue-300 active:bg-slate-100 active:text-slate-700"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          {label}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </span>
      <div
        className={`absolute left-0 z-10 mt-2 mb-10 w-full origin-top-left rounded-md shadow-lg ${
          collapsed ? 'hidden' : ''
        }`}
      >
        <div className="bg-accent-0 shadow-xs rounded-sm lg:bg-none lg:shadow-none">
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <ul className="space-y-0.5 bg-white py-2">
              {options.map((option) => (
                <li
                  role="menuitem"
                  onClick={handleItemClick.bind(null, option)}
                  key={option.key}
                  className={cn(
                    'pointer-cursor focus:bg-accent-1 block cursor-pointer py-0.5 pl-4 text-sm leading-5 hover:bg-blue-50 hover:text-blue-500 focus:text-blue-500 ',
                    {
                      'text-blue-500': option.key === activeKey,
                    }
                  )}
                >
                  {renderOption({
                    ...option,
                    isActive: activeKey === option.key,
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
