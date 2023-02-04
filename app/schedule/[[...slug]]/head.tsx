import { getTimetable } from '@/lib/service/getTimetable'
import { OwnerType } from '@/lib/types/Owner'

export default async function Head({ params }) {
  const { slug } = params
  const [type, id, term] = slug

  if (decodeURIComponent(type) === '[[...slug]]') {
    return null
  }
  const { courses, owner, terms } = await getTimetable(
    type as OwnerType,
    id,
    term
  )

  const name = (owner.label || '') + owner.name

  // todo: 要找一个标签把类型写进去
  return (
    <>
      <title>{`${name}@${term || terms[0]}`}</title>
    </>
  )
}
