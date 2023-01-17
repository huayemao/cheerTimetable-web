import { NewLayout } from '@/components/common/NewLayout'
import Link from 'next/link'

export default async function ScheduleLayout({
  children,
  params,
}: {
  params: any
  children: JSX.Element
}) {
  return (
    <html>
      <head />
      <body>
        {/* 移动端是左返回按钮，桌面端是 logo */}
        <NewLayout
          navSection={
            <>
              <Link href="./" className="text-xl md:hidden">
                {'←'}
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
          title={<>搜索结果</>}
        >
          {children}
        </NewLayout>
      </body>
    </html>
  )
}
