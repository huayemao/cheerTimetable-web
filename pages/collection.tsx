import Layout from 'components/common/Layout'
import { Collection } from 'components/Collection'
import { memo } from 'react'

export default function Component() {
  return (
    <Layout title={'ζηζΆθ'}>
      <div className="h-full p-2">
        <Collection className={'h-full'} />
      </div>
    </Layout>
  )
}
