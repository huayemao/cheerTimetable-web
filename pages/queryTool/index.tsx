import Layout from 'components/common/Layout'
import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { Tooltip } from 'components/common/Tooltip'
import { map, findKey } from 'lodash'
import { PlusIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {}

function QuerTool({}: Props) {
  return <Layout>todo</Layout>
}

export default QuerTool

const QueryToolSelect = () => {
  return (
    <div className="w-max text-center">
      <ul className="divide-y">
        {map(mapping, (v, k) => (
          <li key={k} className="py-2 text-center">
            <Link shallow href={'/?queryTool=' + encodeURIComponent(v)}>
              <a>{k}</a>
            </Link>
          </li>
        ))}
      </ul>
      <Link shallow href={'/queryTool'} passHref>
        <button
          type="button"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          <PlusIcon className="h-5 w-5"></PlusIcon>
        </button>
      </Link>
    </div>
  )
}

const mapping = {
  绮课: '',
  You: 'https://you.com/search?q=',
  知乎: 'https://www.zhihu.com/search?type=content&q=',
  豆瓣: 'https://www.douban.com/search?q=',
}

export function QueryToolSelectDropDown() {
  const router = useRouter()

  const { queryTool } = router.query
  const foundItem = queryTool
    ? findKey(
        mapping,
        (v, k) =>
          decodeURIComponent(v) === decodeURIComponent(queryTool as string)
      ) || '未知'
    : undefined

  const queryToolName = foundItem ?? '绮课'
  return (
    <div className="absolute left-0 h-full">
      <Tooltip
        content={<QueryToolSelect />}
        style="light"
        placement="bottom-start"
        arrow={false}
        trigger="click"
      >
        <button
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="inline-flex h-full  items-center  rounded-l-xl border-slate-300 pl-2 pr-1 text-center  text-sm font-medium text-slate-400  hover:bg-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          {queryToolName}
          <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
        </button>
      </Tooltip>
    </div>
  )
}
