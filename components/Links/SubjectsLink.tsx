import React from 'react'
import Link from 'next/link'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export function SubjectsLink() {
  return (
    <Link
      href={'/subjects'}
      className="text flex w-full text-gray-600 hover:text-blue-500"
    >
      <PaperAirplaneIcon className="mr-2 h-6 w-6 text-blue-500" />
      全部课程
    </Link>
  )
}
