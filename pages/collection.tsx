import Layout from 'components/common/Layout'
import { Collection } from 'components/Collection'
import { memo } from 'react'

export default function Component() {
  return (
    <Layout
      title={
        <div className="text-xl font-light text-blue-500">我的收藏</div>
      }
    >
      <div className="p-2 h-full">
        <Collection className={'h-full'}></Collection>
      </div>
    </Layout>
  )
}
