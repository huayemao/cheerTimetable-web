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
import { useRouter } from 'next/router'
import { OwnerType } from 'lib/types/Owner'
import TERMS from '../../constants/terms'
import { memo, useEffect, useMemo } from 'react'
// https://box-shadow.dev/?ref=tiny-helpers

type Props = {
  courses: CourseItem[]
  title: string
  type: OwnerType
  id: string
}

export default memo(function Schedule({ courses, title, type, id }: Props) {
  const router = useRouter()
  const dispath = usePreferenceDispatch()
  const { show7DaysOnMobile } = usePreference()
  const { term = TERMS[0] } = router.query

  const terms = Array.from(new Set(courses?.map((e) => e.term)))?.sort(
    (a: string, b: string) => b.localeCompare(a)
  ) as string[]

  const navToTerm = (term = terms[0]) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, term },
      },
      undefined,
      { shallow: true }
    )
  }

  // todo: 抽出去
  useEffect(() => {
    // 这个没有 work
    if (!terms.length) return
    if (!router.query.term) {
      navToTerm(terms[0])
    }
  }, [terms])

  const isMobile = useMediaQuery('(max-width: 768px)', true, false)
  const show7days = !isMobile || (isMobile && show7DaysOnMobile)

  const headerTitle = useMemo(
    () => (
      <div className="flex flex-col items-end md:flex-row">
        <h1 className="inline-flex text-xl  font-light text-slate-700 md:mr-4 md:text-2xl">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <select
            onChange={(v) => {
              navToTerm(v.target.value)
            }}
            value={term}
            name="term"
            id=""
            className=" rounded  border border-slate-200 px-2 py-[.12em] text-sm font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
          >
            {terms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={'2'}
            name="week"
            id=""
            className=" rounded  border border-slate-200 px-2 py-[.12em] text-sm font-medium text-slate-700 focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
          >
            <option value="2">全部周</option>
          </select>
        </div>
      </div>
    ),
    [term]
  )

  return (
    <div className={'space-y-4'}>
      <H1 title={headerTitle}>
        {courses?.length ? (
          <div className={'mx-auto space-y-2'}>
            <Timetable
              courses={courses.filter((c) => c.term === term)}
              show7days={show7days}
            />
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
            {`${window.location.origin}/api/ical/${type}/${id}/${term}.ics`}
          </div>
        </div>
      </H2>
    </div>
  )
})
