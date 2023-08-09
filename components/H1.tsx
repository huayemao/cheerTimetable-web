import clsx from 'clsx'
import React, { memo, useEffect, useReducer } from 'react'
import { createPortal } from 'react-dom'

// https://ecomfe.github.io/react-hooks/#/hook/update/use-force-update
export function useForceUpdate() {
  return useReducer((v: number) => v + 1, 0)[1]
}

export default memo(function H1({ title, children }) {
  // 这里有可能挂不上去。。。
  const el = document.querySelector('#headerContent')

  // 刷一下看起来很难受。。
  const update = useForceUpdate()

  useEffect(
    () => {
      update()
    },
    [
      // document.querySelector('body'),
      // window.location.pathname,
      // window.location.search,
    ]
  )

  return (
    <>
      {createPortal(title, el || document.body)}
      <div className={clsx('md:m-2')}>{children}</div>
    </>
  )
})

