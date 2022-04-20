import Link from 'next/link'
import { Owner } from 'lib/types/Owner'
import c from './Timetable.module.css'

type TitleProps = {
  owner: Owner
}

export default function TimetableTitle({ owner }: TitleProps) {
  const { label, name = '...' } = owner
  return (
    <h2 className={c['timetable-title']}>
      {label} {name}的课表
    </h2>
  )
}
