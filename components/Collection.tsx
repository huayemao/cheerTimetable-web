import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import {
  useCollection,
  useCollectionDispatch,
} from 'contexts/collectionContext'
import { map } from 'lodash'
import Link from 'next/link'
import { memo, ReactNode, useState } from 'react'
import { Tab } from '@headlessui/react'
import classNames from 'clsx'
import { Tooltip } from './common/Tooltip'
import { CAN_COLLECT_ROUTES } from '../constants'

type Props = {
  title?: ReactNode
  className: string
}

function Component({ title = '', className }: Props) {
  const dispatch = useCollectionDispatch()
  const data = useCollection()

  const nameMapping = {
    student: '学生',
    teacher: '教师',
    location: '教室',
    subject: '课程',
    course: '开课',
  }

  const pathNameMapping = {
    student: CAN_COLLECT_ROUTES['/schedule/[...all]'],
    teacher: CAN_COLLECT_ROUTES['/schedule/[...all]'],
    location: CAN_COLLECT_ROUTES['/schedule/[...all]'],
    subject: CAN_COLLECT_ROUTES['/subjects/[id]'],
    course: CAN_COLLECT_ROUTES['/courses/[id]'],
  }

  const getHref = (data, type) => {
    const pathname = pathNameMapping[type]

    if (pathname === CAN_COLLECT_ROUTES['/schedule/[...all]']) {
      return {
        pathname,
        query: {
          all: [type, data.id],
        },
      }
    } else {
      return {
        pathname,
        query: {
          id: data.id,
        },
      }
    }
  }

  return (
    <div className={'flex flex-col ' + className}>
      {title && <h4 className="text-lg text-blue-500">{title}</h4>}
      <Tab.Group>
        <Tab.List className="flex justify-center  border-b border-gray-100 text-sm font-medium">
          {map(data, (v, k) => (
            <Tab
              key={k}
              className={({ selected }) =>
                classNames(
                  '-mb-px border-b p-4 ',
                  selected
                    ? 'border-current text-blue-500'
                    : 'border-transparent hover:text-blue-500'
                )
              }
            >
              {nameMapping[k]}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 flex-1 overflow-y-auto">
          {map(data, (v, k) => (
            <Tab.Panel
              key={k}
              className={classNames(
                'h-full rounded-xl p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {v.length > 0 && (
                <ul className="space-y-2 text-left">
                  {v.map((e) => (
                    <li
                      key={e.id}
                      className="hover:bg-coolGray-100 relative  rounded-md bg-white p-3 shadow"
                    >
                      <Link
                        href={getHref(e, k)}
                        className="text-base font-medium leading-5"
                      >
                        {e.name} @<span className="text-sm">{e.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export const Collection = memo(Component)
