import {
  MagnifyingGlassIcon,
  Cog8ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export const BottomTab = () => {
  return (
    <div className="fixed left-4 right-4 bottom-4 z-10 mx-auto flex h-12 items-center justify-between rounded-lg shadow backdrop-blur md:hidden">
      <div className="flex flex-1 justify-center text-center">
        <HomeIcon className="h-8 w-8 text-slate-600" />
      </div>
      <Link href={'/search'} className="flex flex-1 justify-center">
        <MagnifyingGlassIcon className="h-8 w-8 text-slate-600" />
      </Link>
      <div className="flex flex-1 justify-center">
        <Cog8ToothIcon className="h-8 w-8 text-slate-600" />
      </div>
    </div>
  )
}
