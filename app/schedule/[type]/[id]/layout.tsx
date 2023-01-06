import { NewLayout } from '@/components/common/NewLayout'
import { getTimetable } from '@/lib/api/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import ScheduleLayoutTitle from '@/components/ScheduleLayoutTitle'
import Link from 'next/link'

export default async function ScheduleLayout({
  children,
  params,
}: {
  params: any
  children: JSX.Element
}) {
  // layout 中不能取 searchParams 吗？
  const { id, type } = params

  // todo: getScheduleMeta 返回 terms、owner
  const { courses, owner, terms } = await getTimetable(type as OwnerType, id)
  const { name = '', label = '' } = owner
  const title = label + name

  return (
    <html>
      <head />
      <body>
        {/* 移动端是左返回按钮，桌面端是 logo */}
        <NewLayout
          navSection={
            <>
              <Link href="./" className="md:hidden">
                {'<'}
              </Link>
              <Link
                href={'/'}
                className="hidden text-center text-2xl font-semibold text-slate-600 md:block"
              >
                绮课
              </Link>
            </>
          }
          title={<ScheduleLayoutTitle title={title} terms={terms} />}
        >
          {children}
        </NewLayout>
      </body>
    </html>
  )
}
