import React, { useCallback } from 'react'
import { BookmarkIcon } from '@heroicons/react/solid'
import { BookmarkIcon as BookmarkIconO } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { CAN_COLLECT_ROUTES } from '../constants/routes'
import { Course, Subject } from '@prisma/client'
import {
  useCollection,
  useCollectionDispatch,
} from 'contexts/collectionContext'
import { type } from 'os'

const getPageProps = (router) => router.components[router.route].props.pageProps

const getTimeTableMeta = (router): CollectItemMeta => {
  const { owner } = getPageProps(router)
  const [type, id] = router.query.all || []
  const { label, name } = owner || {}
  return {
    type,
    id,
    label,
    name,
  }
}

const getSubjectMeta = (router): CollectItemMeta => {
  const { subject } = getPageProps(router)
  const { id } = router.query
  return {
    type: 'subject',
    id,
    label: (subject as Subject)?.department,
    name: (subject as Subject)?.name,
  }
}

const getCourseMeta = (router): CollectItemMeta => {
  const { course } = getPageProps(router)
  const { id } = router.query
  return {
    type: 'course',
    id,
    label: (course as Course).term,
    name: (course as Course).className,
  }
}

type CollectItemMeta = {
  type: string
  id: string
  label: string
  name: string
}

const mapping: Record<CAN_COLLECT_ROUTES, (router: any) => CollectItemMeta> = {
  [CAN_COLLECT_ROUTES['/curriculum/[...all]']]: getTimeTableMeta,
  [CAN_COLLECT_ROUTES['/subjects/[id]']]: getSubjectMeta,
  [CAN_COLLECT_ROUTES['/courses/[id]']]: getCourseMeta,
}

const CollectButton = () => {
  const router = useRouter()
  const dispatch = useCollectionDispatch()
  const collection = useCollection()
  const fn = mapping[router.route]
  const info = fn(router)
  const handleToggle = useCallback(() => {
    dispatch({
      type: 'SET',
      payload: {
        data: info,
      },
    })
  }, [dispatch, info])

  if (!router.isReady || router.isFallback) {
    return null
  }
  const followed = collection[info.type].find((e) => e.id === info.id)

  return (
    <button
      className="inline-flex items-center"
      onClick={handleToggle}
    >
      <div className="mr-2 h-6 w-6 align-middle text-blue-500">
        {followed ? (
          <BookmarkIcon className="h-5 w-5" />
        ) : (
          <BookmarkIconO className="h-5 w-5" />
        )}
      </div>
      {followed && '已'}收藏
    </button>
  )
}

export default CollectButton
