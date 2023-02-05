import { getTimetable } from '@/lib/service/getTimetable'
import { OwnerType } from '@/lib/types/Owner'

export default async function Head({ params }) {
  const { slug } = params
  const [type, id, term] = slug

  if (decodeURIComponent(type) === '[[...slug]]') {
    return null
  }
  const { owner } = await getTimetable(type as OwnerType, id, term)

  return (
    <>
      <title>{`${owner.name}@${owner.label}`}</title>
    </>
  )
}
