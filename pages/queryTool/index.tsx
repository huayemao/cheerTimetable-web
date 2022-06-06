import Layout from 'components/common/Layout'
import React, { useCallback } from 'react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { Tooltip } from 'components/common/Tooltip'
import { map, find } from 'lodash'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { TextInput } from 'components/common/FormControls/TextInput'
import { Label } from 'components/common/FormControls/Label'
import { useForm } from 'lib/hooks/useForm'
import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'

type Props = {}

function QuerTool({}: Props) {
  const initialState = {
    name: '',
    url: '',
  }
  const [values, setValues] = useForm(initialState)
  const { queryTools } = usePreference()
  const dispatch = usePreferenceDispatch()

  const handleConfirm = useCallback(() => {
    dispatch({
      type: 'ADD_QUERY_TOOL',
      payload: {
        queryTool: values,
      },
    })
  }, [dispatch, values])

  return (
    <Layout title={'个性化搜索框'}>
      <div className="h-full bg-slate-100">
        <div className="flex flex-wrap items-start gap-4 px-8 py-4">
          <div className="w-full bg-white p-4 shadow-lg lg:w-max lg:grow-[2]">
            <h3 className="mb-4 text-2xl text-gray-500">添加搜索引擎</h3>

            <div className="flex flex-col gap-4">
              <div>
                <Label className="mb-2 block" htmlFor="email">
                  查询网址
                </Label>
                <TextInput
                  onChange={setValues}
                  type={'url'}
                  name="url"
                  placeholder="https://you.com/search?q="
                  required={true}
                  shadow={true}
                  helperText={<React.Fragment>输入搜索用的 url</React.Fragment>}
                />
              </div>
              <div>
                <Label className="mb-2 block" htmlFor="email">
                  名称
                </Label>
                <TextInput
                  onChange={setValues}
                  type="text"
                  name="name"
                  placeholder="You"
                  required={true}
                  shadow={true}
                  helperText={<React.Fragment>名称</React.Fragment>}
                />
              </div>
              <button
                onClick={handleConfirm}
                type="button"
                className="flex self-end rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800"
              >
                添加
              </button>
            </div>
          </div>
          <ul className="col-span-3 space-y-4 p-4 lg:grow-[3]">
            {map(queryTools, ({ name, url }) => (
              <li
                key={name}
                className="relative rounded bg-white p-4 py-2 shadow"
              >
                <h4 className="text-xl font-bold text-blue-500">{name}</h4>
                <p className="text-sm font-medium tracking-widest text-gray-500">
                  {url}
                </p>
                <button
                  className="text-gray-500"
                  onClick={() => {
                    dispatch({
                      type: 'REMOVE_QUERY_TOOL',
                      payload: {
                        name,
                      },
                    })
                  }}
                >
                  <XIcon className="absolute top-2 right-2 h-5 w-5"></XIcon>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default QuerTool

const QueryToolSelect = ({ queryTools }) => {
  return (
    <div className="w-max text-center">
      <ul className="divide-y">
        <li key={'绮课'} className="py-2 text-center">
          <Link shallow href={'/'}>
            <a>绮课</a>
          </Link>
        </li>
        {map(queryTools, ({ name, url }) => (
          <li key={name} className="py-2 text-center">
            <Link shallow href={'/?queryTool=' + encodeURIComponent(url)}>
              <a>{name}</a>
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

export function QueryToolSelectDropDown() {
  const { queryTools } = usePreference()
  const router = useRouter()

  const { queryTool } = router.query
  const foundItem = queryTool
    ? find(
        queryTools,
        ({ name, url }) =>
          decodeURIComponent(url) === decodeURIComponent(queryTool as string)
      )?.name || '未知'
    : undefined

  const queryToolName = foundItem ?? '绮课'
  return (
    <div className="absolute left-0 h-full">
      <Tooltip
        content={<QueryToolSelect queryTools={queryTools} />}
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
