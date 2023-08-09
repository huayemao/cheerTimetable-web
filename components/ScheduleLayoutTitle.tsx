'use client'
import { useCallback } from 'react'
import { useTerm } from '../lib/hooks/useTerm'
import CollectButton from './CollectButton'

type props = {
  title: string
  label?: string
  terms: string[]
  grades?: string[]
}

export default function ScheduleLayoutTitle({
  title,
  terms,
  grades,
  label,
}: props) {
  const { navToTerm, activeTerm, prefetchTerms } = useTerm()
  const prefetch = useCallback(() => {
    prefetchTerms(terms)
  }, [terms])

  return (
    <div className="flex flex-col items-center justify-center gap-1 w-full md:flex-row md:items-end">
      <h1 className="inline-flex text-xl  font-light text-slate-700 md:mr-4 md:text-2xl max-w-[80%]"
      style={{textWrap:'balance'}}
      >
        {title} <sub style={{ lineHeight: 'unset' }}>{label}</sub>
      </h1>
      <div className="flex items-center justify-center gap-2">
        {(terms?.length && (
          <select
            onFocus={prefetch}
            onChange={(v) => {
              navToTerm(v.target.value)
            }}
            value={activeTerm || terms[0]}
            name="term"
            id="term"
            className="rounded  border border-slate-200 bg-white px-[.2em] py-[.12em] text-xs font-medium text-slate-700 focus:border-transparent focus:ring-1 focus:ring-slate-500 md:text-sm"
          >
            {terms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )) ||
          null}
        {(grades?.length && (
          <select
            onChange={() => {}}
            value={activeTerm || terms[0]}
            name="grade"
            id="grade"
            className="rounded  border border-slate-200 bg-white px-[.2em] py-[.12em] text-xs font-medium text-slate-700 focus:border-transparent focus:ring-1 focus:ring-slate-500 md:text-sm"
          >
            {grades.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )) ||
          null}
        {/* <select
          defaultValue={'2'}
          name="week"
          id=""
          className="rounded  border border-slate-200 bg-white px-[.2em] py-[.12em] text-xs font-medium text-slate-700 focus:border-transparent focus:ring-1 focus:ring-slate-500"
        >
          <option value="2">全部周</option>
        </select> */}
        <CollectButton />
      </div>
    </div>
  )
}
