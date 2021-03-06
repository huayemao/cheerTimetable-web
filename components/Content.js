import { Timetable } from 'components/Timetable'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import Loading from './Loading'
import { usePreference } from 'contexts/preferenceContext'
import Empty from './Empty'

export function Content({ courses, icsUrl }) {
  const isMobile = useMediaQuery('(max-width: 768px)', true, false)
  const { show7DaysOnMobile } = usePreference()

  return (
    <>
      {courses?.length ? (
        <Timetable
          courses={courses}
          show7days={!isMobile || (isMobile && show7DaysOnMobile)}
        />
      ) : (
        <>
          <Empty content={'这里一节课都没有呀'} />

        </>
      )}
      <div className=" mx-6 mt-4 self-start break-all font-thin leading-6 text-blue-500">
        <h4 className="text-medium text-gray-500"> 日历订阅 (experimental):</h4>
        <div className="text-xs">{icsUrl}</div>
      </div>
    </>
  )
}
