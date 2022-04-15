import Link from 'next/link'
import { Owner } from 'lib/types/Owner'

type TitleProps = {
  owner: Owner
}

export default function TimetableTitle({ owner }: TitleProps) {
  const { label, name = '...' } = owner
  return (
    <h2 className="text-xl font-thin text-blue-500">
      {label}
      {name}的课表
    </h2>
  )
}
