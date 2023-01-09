'use client'
import { useRouter } from 'next/navigation'
import Search from '../Search'

export function SideBarSearch() {
  const router = useRouter()
  return (
    <div className="flex w-full px-4">
      <Search
        wrapperClassName={'flex-1'}
        iconClassName={'text-slate-400'}
        className=" rounded text-sm ring-1 ring-slate-300 focus:ring-blue-400"
        onSubmit={(v) => router.push(`/search?query=${v}`)}
        placeholder={'搜索'}
      />
    </div>
  )
}
