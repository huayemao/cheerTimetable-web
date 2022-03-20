import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Location, Student, Teacher } from '@prisma/client'
import Container from 'components/Container'
import { OwnerType } from 'lib/types/Owner'

export function SearchResult({
  data,
}: {
  data: [Student[], Teacher[], Location[]]
}) {
  const [students, teachers, locations] = data
  const router = useRouter()
  const { type = OwnerType.student } = router.query

  const payload = useMemo(() => {
    const mapping = {
      [OwnerType.student]: {
        data: students,
        key: 'className',
      },
      [OwnerType.teacher]: {
        data: teachers,
        key: 'facultyName',
      },
      [OwnerType.location]: {
        data: locations,
        key: 'building',
      },
    }
    return mapping[type as string]
  }, [locations, students, teachers, type])

  return (
    <Container>
      {payload.data.length ? (
        <div className="rounded border-t-2 border-blue-300 shadow">
          <ul className="space-y-1 text-gray-900 ">
            {payload.data.map((e) => (
              <li
                className="relative inline-flex w-full items-center rounded-t-lg   py-2 px-4  font-thin  hover:bg-blue-50 hover:text-blue-500"
                key={e.id}
              >
                <Link href={`/curriculum/${type}/${e.id}`}>
                  <a>
                    {e.name} {'  '}
                    {e[payload.key]}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          没有任何结果哦
        </div>
      )}
    </Container>
  )
}
