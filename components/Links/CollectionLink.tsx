import { CircleStackIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

export function CollectionLink() {
  return (
    <Link className="inline-flex items-center" href="/collection" shallow>
      <div className="mr-2 h-6 w-6 align-middle text-blue-500">
        <CircleStackIcon />
      </div>
      我的收藏
    </Link>
  )
}
