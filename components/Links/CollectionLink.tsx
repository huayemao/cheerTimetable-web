import { CollectionIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'

export function CollectionLink() {
  return (
    <Link href="/collection" shallow>
      <a className="inline-flex items-center">
        <div className="mr-2 h-6 w-6 align-middle text-blue-500">
          <CollectionIcon />
        </div>
        我的收藏
      </a>
    </Link>
  )
}
