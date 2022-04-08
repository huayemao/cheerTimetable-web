import React from 'react'
import { HeartIcon } from '@heroicons/react/outline'

export function HealthLink() {
  return (
    <a
      className="text flex w-full text-gray-600 hover:text-blue-500"
      href="https://wxxy.csu.edu.cn/ncov/wap/default/index"
    >
      <HeartIcon className="mr-2 h-6 w-6 text-blue-500" />
      健康打卡
    </a>
  )
}
