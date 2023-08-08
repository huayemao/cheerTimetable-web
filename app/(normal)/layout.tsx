import { NewLayout } from '@/components/common/NewLayout'

export default async function ScheduleLayout({
  children,
  params,
}: {
  children: JSX.Element
  params: any
}) {
  return <NewLayout>{children}</NewLayout>
}
