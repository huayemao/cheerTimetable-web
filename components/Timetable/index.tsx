'use client'
import Timetable from './Main'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'
import Empty from '../Empty'
import { H2 } from '../H2'
import H1 from '../H1'
import { CourseItem } from 'lib/types/CourseItem'
import { OwnerType } from 'lib/types/Owner'
import { memo, useEffect, useMemo } from 'react'
import { useTerm } from '@/lib/hooks/useTerm'
import { useLayoutDispatch } from 'contexts/layoutContext'
// https://box-shadow.dev/?ref=tiny-helpers

// https://beta.nextjs.org/docs/upgrade-guide#step-4-migrating-pages
// If your previous page used useRouter, you'll need to update to the new routing hooks.
// 妈的，useRouter 全都要改
// https://beta.nextjs.org/docs/api-reference/use-router

type Props = {
  courses: CourseItem[]
  type: OwnerType
  id: string
  title: string
  terms: string[]
}

export default memo(function Schedule({
  courses,
  type,
  id,
  title,
  terms,
}: Props) {
  // todo: 抽一个 useTerm 吧

  const { hasTermSearchParam, navToTerm, activeTerm } = useTerm()

  const dispath = useLayoutDispatch()
  // @ts-ignore
  const { show7DaysOnMobile } = usePreference()

  const isMobile = useMediaQuery('(max-width: 768px)', true, false)
  const show7days = !isMobile || (isMobile && show7DaysOnMobile)

  useEffect(() => {
    setTimeout(() => {
      dispath({
        type: 'SET_SCHEDULE_HEADER',
        payload: {
          data: {
            title,
            terms,
          },
        },
      })
    }, 0)
  }, [])

  return (
    <div className={'space-y-4'}>
      <H1 title={<></>}>
        {courses?.length ? (
          <div className={'mx-auto'}>
            <Timetable courses={courses} show7days={show7days} />
          </div>
        ) : (
          <Empty content={'这里一节课都没有呀'} />
        )}
      </H1>

      <H2 close title={'日历订阅'}>
        <div className="break-all font-thin leading-6">
          <h4 className="text-medium text-slate-600">
            {' '}
            订阅当前学期日历 (experimental):
          </h4>
          <div className="text-sm">
            {`${window?.location?.origin}/api/ical/${type}/${id}/${activeTerm}.ics`}
          </div>
        </div>
      </H2>
    </div>
  )
})
