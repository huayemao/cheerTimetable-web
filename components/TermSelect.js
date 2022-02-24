import Link from 'next/link'
import { TERMS } from '../constants'
import Select from 'components/Select'
import { getTermsByStudent } from 'lib/term'
import { useRouter } from 'next/router'

export function TermSelect({ handleOnchange = console.log }) {
  const router = useRouter()
  const [type, id, term = '2021-2022-2'] = router.query.all
  const rawTermList = type === 'student' ? getTermsByStudent(id) : TERMS.baseTerms
  const termItems = rawTermList.map((e) => ({ key: e, label: e + ' 学期' }))

  return (
    <Select
      onChange={handleOnchange}
      options={termItems}
      renderOption={({ label, key, isActive }) => (
        <Link href={`/curriculum/${type}/${id}/${key}`}>
          <a
            href="#"
            className="group flex w-full items-center rounded-lg p-1 pl-4 font-normal transition duration-75"
          >
            {label}
          </a>
        </Link>
      )}
    ></Select>
  )
}
