import { NewLayout } from '@/components/common/NewLayout'
import { SearchArea } from './search/SearchArea'

export default async function ScheduleLayout({
  children,
  params,
}: {
  children: JSX.Element
  params: any
}) {
  return (
    <NewLayout
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
