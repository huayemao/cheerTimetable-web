import React from 'react'
import { Empty as IconEmpty } from './Icons'

type Props = {
  content?: string
}

export default function Empty({ content = '好像什么都没有呀' }: Props) {
  return (
    <div>
      <div className="flex h-96 w-96 flex-col items-center justify-center">
        <IconEmpty className="text-6xl text-blue-400 mb-4" />
        <p className="text-center text-sm  leading-5 text-gray-500 sm:text-lg">
          {content}
        </p>
      </div>
    </div>
  )
}
