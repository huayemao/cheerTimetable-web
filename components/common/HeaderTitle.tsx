'use client'

import { SearchArea } from 'app/search/SearchArea'
import { useLayout } from 'contexts/layoutContext'
import { useSelectedLayoutSegments } from 'next/navigation'
import ScheduleLayoutTitle from '../ScheduleLayoutTitle'

export function HeaderTitle({}) {
  const segments = useSelectedLayoutSegments()
  const { title, terms } = useLayout()

  if (segments[0] === 'courses') {
    return <>开课详情</>
  }

  if (segments[0] === 'collection') {
    return <>我的收藏</>
  }

  if (segments.includes('schedule') && title) {
    return <ScheduleLayoutTitle title={title} terms={terms} />
  }
  // todo: 这里再 useLayout ，优先根据这里面的来渲染，以解决 schedule title 的问题
  if (segments.includes('search')) {
    return (
      <>
        <div className="flex justify-center md:hidden">
          <SearchArea />
        </div>
        <span className="hidden md:inline">搜索</span>
      </>
    )
  }
  return <></>
}
