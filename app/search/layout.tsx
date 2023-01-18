import { NewLayout } from '@/components/common/NewLayout'
import Link from 'next/link'
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid'
import { SearchArea } from './SearchArea'

export default async function ScheduleLayout({
  children,
  params,
}: {
  params: any
  children: JSX.Element
}) {
  return (
    <NewLayout
      navSection={
        <>
          <Link href="/" className="block h-6 w-6 md:hidden">
            <ArrowLongLeftIcon className="h-6 w-6 " />
          </Link>
          <Link
            href={'/'}
            className="hidden text-center text-2xl font-semibold text-slate-600 md:block"
          >
            绮课
          </Link>
        </>
      }
      /* 这里的困难是 layout 无法拿到 searchParams */
      title={
        <>
          <div className="flex justify-center md:hidden">
            <SearchArea />
          </div>
          <span className="hidden md:inline">搜索</span>
        </>
      }
    >
      {children}
    </NewLayout>
  )
}
