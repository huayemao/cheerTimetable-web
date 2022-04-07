import { useRouter } from 'next/router'
import { Fragment, useCallback, useMemo } from 'react'
import { useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useDerivedState } from 'lib/hooks/useDerivedState'
import { useMenuDispatch } from 'contexts/menuContext'

export function DepartmentSelect({ departments }) {
  const router = useRouter()
  const people = departments

  const { departmentName } = router.query

  const [query, setQuery] = useState('')
  const paramD = decodeURIComponent(departmentName as string)

  const [selected, setSelected] = useState(paramD)
  // selected 最初为何是 'undefined'

  const filteredPeople = useMemo(
    () =>
      query === ''
        ? people
        : people.filter((person) =>
            person
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, ''))
          ),
    [people, query]
  )

  const handleOnchange = useCallback(
    (v) => {
      setSelected(v)
      toggleCollapsed()
      router.push(
        {
          pathname: router.pathname,
          query: {
            departmentName: v,
          },
        },
        undefined,
        { shallow: true }
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  )

  const toggleCollapsed = useMenuDispatch()

  const handleQueryChange = useCallback(
    (event) => setQuery(event.target.value),
    []
  )

  return (
    <Combobox
      value={
        selected === 'undefined'
          ? paramD === 'undefined'
            ? '选择开课单位'
            : paramD
          : selected
      }
      onChange={handleOnchange}
    >
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden text-left shadow  focus:outline-none">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus-visible:outline-none focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm"
            // displayValue={selected || paramD}
            onChange={handleQueryChange}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-50 text-blue-500' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-blue-500'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5 text-blue-500" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}
