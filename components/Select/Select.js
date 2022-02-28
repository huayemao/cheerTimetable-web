import React, { useState } from 'react'
import cn from 'clsx'
import { useRef } from 'react'
import useClickOutside from 'lib/hooks/useClickOutside'
import useCollapsible from 'lib/hooks/useCollapsible'

export default function Select({
  options,
  defaultValue,
  onChange = () => {},
  renderOption = (e) => e.label,
}) {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  })
  const [activeKey, setActiveKey] = useState(defaultValue || options[0].key)

  const label = options.find((e) => e.key === activeKey).label

  const ref = useRef()
  useClickOutside(ref, () => {
    !collapsed && toggleCollapsed()
  })

  return (
    <div ref={ref} className="relative inline-block w-full">
      <span className="rounded-md shadow-sm">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="border-accent-3 bg-accent-0 text-accent-4 hover:text-accent-5 focus:shadow-outline-normal active:bg-accent-1 active:text-accent-8 flex w-full justify-between rounded-sm border px-4 py-3 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none"
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
            <ul className="bg-white">
              {options.map((option) => (
                <li
                  onClick={() => {
                    setActiveKey(option.key)
                    onChange(option.key)
                  }}
                  key={option.key}
                  className={cn(
                    'pointer-cursor before:hover:bg-accent-1 focus:bg-accent-1 block cursor-pointer p-1 text-sm leading-5 hover:text-blue-500 focus:text-blue-500 focus:outline-none lg:hover:bg-transparent',
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
