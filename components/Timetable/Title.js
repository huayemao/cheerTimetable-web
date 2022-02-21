import Link from 'next/link'

export default function TimetableTitle({ ownerName, ownerType }) {
  return (
    <h2 className="text-xl font-thin text-blue-500">
      {ownerType}
      {ownerName}的课表
    </h2>
  )
}
