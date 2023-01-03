import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Location, Student, Teacher } from '@prisma/client'
import Container from 'components/Container'
import { OwnerType } from 'lib/types/Owner'
import List from './common/List'
import Empty from './Empty'

export function SearchResult({
  data,
}: {
  data: [Student[], Teacher[], Location[]]
}) {
  const [students, teachers, locations] = data
  const router = useRouter()
  const { type = OwnerType.student } = router.query

  const lists = [
    {
      data: students,
      key: 'className',
      id: 'students',
      label: '学生',
      type: OwnerType.student,
    },
    {
      data: teachers,
      key: 'facultyName',
      id: 'teachers',
      label: '授课教师',
      type: OwnerType.teacher,
    },
    {
      data: locations,
      key: 'building',
      label: '授课地点',
      type: OwnerType.location,
    },
  ]

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

  const hasResult = lists.some((e) => e.data.length)

  return (
    <Container className="space-y-10">
      {hasResult ? (
        lists.map((list) => {
          return (
            (list.data.length && (
              <div
                key={list.id}
                className="mx-10 rounded border-t-2 border-t-blue-300 p-4 shadow-md"
                id={list.id}
              >
                <div className="text-gray-600"> {list.label}</div>
                <List
                  data={list.data}
                  renderListItem={(e, i) => {
                    return (
                      <Link href={`/schedule/${list.type}/${e.id}`}>
                        <span className="font-medium text-blue-400">
                          #{i + 1}
                        </span>
                        &emsp;
                        <span className="text-lg">{e.name}</span>&emsp;
                        {e[list.key]}
                      </Link>
                    )
                  }}
                />
              </div>
            )) ||
            null
          )
        })
      ) : (
        <div className="flex w-full justify-center">
          <Empty />
        </div>
      )}
    </Container>
  )
}
