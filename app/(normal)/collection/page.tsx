import { Collection } from 'components/Collection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `我的收藏`,
}

export default function Component() {
  return (
    <div className="h-full p-2">
      <Collection className={'h-full'} />
    </div>
  )
}
