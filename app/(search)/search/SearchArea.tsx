'use client'
import Search from '@/components/Search'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export const SearchArea = () => {
  const router = useRouter()
  const sp = useSearchParams()
  const q = sp?.get('query') || ''
  return (
    <Search
      wrapperClassName={'m-4'}
      defaultValue={q}
      iconClassName={'text-slate-400'}
      className=" rounded text-sm ring-1 ring-slate-300 focus:ring-blue-400"
      onSubmit={(v) => router.push(`/search?query=${v}`)}
      placeholder={'搜索'}
    />
  )
}
