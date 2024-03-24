'use client'

import { useEffect } from 'react'
import { useForceUpdate } from '../H1'

export default function HeaderTitle({}) {
  const update = useForceUpdate()

  useEffect(() => {
    update()
  }, [document.title,window.location.href])

  if (document.title.includes('——')) {
    const [title, sub] = document.title.replace('。', '').split('——')
    return (
      <>
        {title}
        {'  '}
        <sub className="text-xs md:text-sm" style={{fontFamily: 'roboto'}}>{sub}</sub>
      </>
    )
  }
  return <>{document.title.split(' | ')[0]}</>
}
