import { Collection } from 'components/Collection'
import { APP_NAME } from 'constants/siteConfig'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `我的收藏 | ${APP_NAME}`,
}

export default function Component() {
  return (
    <div className="h-full p-2">
      <Collection className={'h-full'} />
    </div>
  )
}
