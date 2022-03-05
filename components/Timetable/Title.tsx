import Link from 'next/link'
import { Owner } from 'lib/types/Owner'

type TitleProps = {
  owner: Owner
}

export default function TimetableTitle({ owner }: TitleProps) {
  return (
    <h2 className="text-xl font-thin text-blue-500">
      {owner.label}
      {owner.name}的课表
    </h2>
  )
}
