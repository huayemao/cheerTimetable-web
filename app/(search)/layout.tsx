import { NewLayout } from '@/components/common/NewLayout'
import { SearchArea } from './search/SearchArea'

export default async function ScheduleLayout({
  children,
  params,
}: {
  children: JSX.Element
  params: any
  searchParams: any
}) {
  return (
    <NewLayout
      title={
        <div className='w-full flex justify-center'>
          <SearchArea />
        </div>
      }
    >
      {children}
    </NewLayout>
  )
}
