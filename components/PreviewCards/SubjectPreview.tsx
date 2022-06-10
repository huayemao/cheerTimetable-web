import { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ArrowNarrowRightIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { EyeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Subject } from '@prisma/client'
import List from '../common/List'

export function SubjectPreview({
  subject,
  disableLink = false,
}: {
  subject: Subject
  disableLink?: boolean
}) {
  const router = useRouter()
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`h-full w-fit overflow-hidden bg-white shadow-lg ${
              open ? '' : 'text-opacity-90'
            }`}
          >
            <div className="space-y-2  overflow-hidden rounded-lg border-gray-100 p-4 text-left  sm:col-span-2">
              <h5 className="mt-4 font-semibold text-gray-600">
                {subject.name}
              </h5>
              <p className="mt-2 text-sm text-gray-500">#{subject.id}</p>
              <p className="mt-2 text-sm text-gray-500">{subject.department}</p>
              <ul className="flex flex-wrap">
                <li className="m-0.5 inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500">
                  {subject.credit}学分
                </li>
                <li className="m-0.5 inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500">
                  {subject.tuitionHour}学时
                </li>
              </ul>
              {!disableLink && (
                <div className="flex w-full justify-end">
                  <Link
                    href={{
                      pathname: '/subjects/[id]',
                      query: { id: subject.id },
                    }}
                    key={subject.id}
                    passHref
                  >
                    <a
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2  inline-flex items-center justify-center rounded border  px-2 py-1 text-gray-500 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring active:bg-blue-500"
                    >
                      <span className="text-sm font-medium">全部开课</span>
                      <ArrowNarrowRightIcon className="ml-3 h-3 w-3" />
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 ml-2 min-w-full -translate-x-1/2 transform rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500  p-1  shadow-xl  lg:max-w-3xl">
              <div className="absolute -top-3 left-24 inline-block w-8 overflow-hidden">
                <div className="h-4 w-4 origin-bottom-left rotate-45 transform bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
              </div>
              <ul className="block space-y-1  rounded-xl bg-white p-4 text-gray-700 ">
                <li>课程类型： {subject.category}</li>
                {subject.tuitionHourDetail.split('-').map((hour, i) => (
                  <li key={i}>
                    {
                      [
                        '讲课学时',
                        '实践学时',
                        '上机学时',
                        '实验学时',
                        '见习学时',
                      ][i]
                    }
                    {'：'}
                    {hour}
                  </li>
                ))}
              </ul>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

function SubjectDetail({ subject }) {
  const [data, setData] = useState(null)

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-orange-700 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span>Solutions</span>
            <ChevronDownIcon
              className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2  mt-3 w-screen max-w-sm -translate-x-1/2 transform bg-white px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                {<>{JSON.stringify(data)}</>}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
