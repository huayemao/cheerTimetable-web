import { Timetable } from 'components/Timetable'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import { usePreference } from 'contexts/preferenceContext'
import Empty from './Empty'
import s from './Content.module.css'
// https://box-shadow.dev/?ref=tiny-helpers

export function Content({ courses, icsUrl, title }) {
  const isMobile = useMediaQuery('(max-width: 768px)', true, false)
  const { show7DaysOnMobile } = usePreference()
  const show7days = !isMobile || (isMobile && show7DaysOnMobile)

  return (
    <div className={'mx-auto space-y-4 py-4'}>
      <h2 className='text-xl text-gray-900 font-semibold'>课表</h2>

      {courses?.length ? (
        <div
          className={'rounded-lg bg-white p-10 pt-4 space-y-2 ' + s.card}
        >
          <div className='flex gap-4 items-center ring-slate-300'>
            <h3 className='text-slate-900'>{title} 的课表 </h3>
            <div className="border-slate-200 border px-2 py-[.12em] rounded text-slate-700 font-medium text-sm">
              {/* todo: useSchedule，读学期、周数 */}
              2022-2023-1
            </div>
            <div className="border-slate-200 border px-2 py-[.12em] rounded text-slate-700 font-medium text-sm">全部周</div>
          </div>
          <Timetable
            courses={courses}
            show7days={show7days}
          />
        </div>
      ) : (
        <Empty content={'这里一节课都没有呀'} />
      )}
      <div className="mt-4 break-all font-thin leading-6">
        <h4 className="text-medium text-slate-600"> 日历订阅 (experimental):</h4>
        <div className="text-sm">{icsUrl}</div>
      </div>
    </div>
  )
}
