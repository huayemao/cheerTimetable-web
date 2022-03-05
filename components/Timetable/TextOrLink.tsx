import Link from 'next/link'
import { OwnerType } from 'lib/types/Owner'
import { getNameById } from 'lib/api/getMeta'

export const TextOrLink = ({
  type,
  id,
  canLink = false,
}: {
  type: OwnerType
  id: string
  canLink?: boolean
}) => {
  let name = getNameById(type, id)
  if (type === OwnerType.teacher) {
    name = !!name ? name.replace(/\[.*\]/, '') : 'unknown'
  }
  return canLink ? (
    <Link href={`/curriculum/${type}/${id}`}>
      <a className="underline">{name}</a>
    </Link>
  ) : (
    name
  )
}
