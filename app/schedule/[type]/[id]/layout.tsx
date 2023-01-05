import { NewLayout } from '@/components/common/NewLayout'
import { getTimetable } from '@/lib/api/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import ScheduleLayoutTitle from '@/components/ScheduleLayoutTitle'



export default async function ScheduleLayout({
  children,
  params,
}: {
  params: any
  children: JSX.Element
}) {
  const { id, type } = params

  const { courses, owner } = await getTimetable(type as OwnerType, id)
  const { name = '', label = '' } = owner
  const title = label + name

  return (
    <html>
      <head />
      <body>
        {/* 移动端是左返回按钮，桌面端是 logo */}
        <NewLayout
          navSection={<>{'<'}</>}
          title={<ScheduleLayoutTitle title={title} courses={courses} />}
        >
          {children}
        </NewLayout>
      </body>
    </html>
  )
}
