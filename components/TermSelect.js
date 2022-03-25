import Link from 'next/link'
import { TERMS } from '../constants'
import Select from 'components/Select'
import { getTermsByStudent } from 'lib/term'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export default function TermSelect({
  handleOnchange = console.log,
  className = '',
}) {
  const router = useRouter()
  const [type, id] = router.query.all
  const { term = '2021-2022-2' } = router.query
  const rawTermList = type === 'student' ? getTermsByStudent(id) : TERMS
  const termItems = rawTermList.map((e) => ({ key: e, label: e + ' 学期' }))
  const renderOption = useCallback(
    ({ label, key, isActive }) => (
      <Link href={`/curriculum/${type}/${id}?term=${key}`} shallow>
        <a
          href="#"
          className="group flex w-full items-center rounded-lg p-1 pl-4 font-normal transition duration-75"
        >
          {label}
        </a>
      </Link>
    ),
    [id, type]
  )

  return (
    <Select
      className={className}
      onChange={handleOnchange}
      options={termItems}
      defaultValue={term}
      renderOption={renderOption}
    ></Select>
  )
}
