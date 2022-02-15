import Link from 'next/link'

export default function Timetable({ ownerName, ownerType }) {
  return (
    <div className="flex ">
      <Link href={'/'}>
        <a className="text-blue-300 hover:text-blue-500">绮课</a>
      </Link>
      <h2 className="mx-3 mb-5 text-2xl text-blue-500">
        {ownerType}
        {ownerName}的课表
      </h2>
    </div>
  )
}
