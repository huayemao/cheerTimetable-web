'use client'
import React, { useCallback } from 'react'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { CAN_COLLECT_ROUTES } from '../constants/routes'
import { Course, Subject } from '@prisma/client'
import {
  useCollection,
  useCollectionDispatch,
} from 'contexts/collectionContext'
import { useSelectedLayoutSegments } from 'next/navigation'
import { StarIcon } from '@heroicons/react/24/solid'
// todo: 从 document title 去读吧

type CollectItemMeta = {
  type: string
  id: string
  label: string
  name: string
}

export const CollectButton = () => {
  const dispatch = useCollectionDispatch()
  const collection = useCollection()
  const segments = useSelectedLayoutSegments()
  // [ 'schedule', 'student/8210221303' ] 为什么会是这样？

  const info: CollectItemMeta = getType(segments)
  const handleToggle = useCallback(() => {
    dispatch({
      type: 'SET',
      payload: {
        data: info,
      },
    })
  }, [dispatch, info])

  const followed = collection[info.type].find((e) => e.id === info.id)

  return (
    <button className="inline-flex items-center" onClick={handleToggle}>
      <div className="mr-2 h-6 w-6 align-middle text-blue-500">
        {followed ? (
          <StarIcon className="h-5 w-5" />
        ) : (
          <StarIconOutline className="h-5 w-5" />
        )}
      </div>
      {followed && '已'}收藏
    </button>
  )
}

export default CollectButton

function getType(segments: string[]) {
  let type: string | null = null
  let id: string | null = null
  if (segments[0] === 'schedule') {
    ;[type, id] = segments[1].split('/')
  }
  return {
    type,
    id,
    label: document.title,
    name: '',
  }
}
