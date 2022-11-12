import Link from 'next/link'
import Select from 'components/common/Select'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useMenuDispatch } from 'contexts/menuContext'

export default function TermSelect({
  handleOnchange = console.log,
  terms = [],
  className = '',
}) {
  const router = useRouter()
  const toggleCollapsed = useMenuDispatch()
  const [type, id] = router.query.all || []
  const { term } = router.query
  const rawTermList = terms
  const termItems = rawTermList.map((e) => ({ key: e, label: e + ' 学期' }))
  const renderOption = useCallback(
    ({ label, key, isActive }) => (
      <Link replace href={`/curriculum/${type}/${id}?term=${key}`} shallow>
        <a
          href="#"
          className="group flex w-full items-center rounded-lg p-1 pl-4 font-normal"
        >
          {label}
        </a>
      </Link>
    ),
    [id, type]
  )

  useEffect(() => {
    if (!termItems.length) return
    if (!term && Object.keys(router.query).length) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, term: rawTermList[0] },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [rawTermList, router, term, termItems.length])

  return (
    <Select
      className={className}
      onChange={() => {
        handleOnchange()
        toggleCollapsed()
      }}
      options={termItems}
      defaultValue={term}
      defaultLabel={'没有任何记录哦'}
      renderOption={renderOption}
    ></Select>
  )
}
