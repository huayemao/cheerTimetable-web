import { Timetable } from 'components/Timetable'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import { usePreference } from 'contexts/preferenceContext'
import Empty from './Empty'
import s from './Content.module.css'
import { H2 } from './H2'
import { H1 } from "./H1"
// https://box-shadow.dev/?ref=tiny-helpers

export function Content({ courses, icsUrl, title }) {
  const isMobile = useMediaQuery('(max-width: 768px)', true, false)
  const { show7DaysOnMobile } = usePreference()
  const show7days = !isMobile || (isMobile && show7DaysOnMobile)

  return (
    <div className={'space-y-4'}>
      <H1 title={<div className='flex flex-col items-end md:flex-row'>
        <h1 className="inline-flex text-xl  font-light text-slate-700 md:text-2xl md:mr-4">
          {title}</h1>
        <div className='flex gap-2 items-center'>
          <div className="border-slate-200 border px-2 py-[.12em] rounded text-slate-700 font-medium text-sm">
            {/* todo: useSchedule，读学期、周数 */}
            2022-2023-1
          </div>
          <div className="border-slate-200 border px-2 py-[.12em] rounded text-slate-700 font-medium text-sm">全部周</div>
        </div>
      </div>} isMainContent>
        {courses?.length ? (
          <div
            className={'space-y-2 mx-auto'}
          >

            <Timetable
              courses={courses}
              show7days={show7days}
            />
          </div>
        ) : (
          <Empty content={'这里一节课都没有呀'} />
        )}
      </H1>

      <H2 close title={'日历订阅'}>
        <div className="break-all font-thin leading-6">
          <h4 className="text-medium text-slate-600"> 订阅当前学期日历 (experimental):</h4>
          <div className="text-sm">{icsUrl}</div>
        </div>
      </H2>

    </div >
  )
}
