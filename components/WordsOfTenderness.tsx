import { Quote as IconQuote } from './Icons'
import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'

export function WordsOfTenderness({ list, onChange, activeIndex }) {
  const intervalRef = useRef(Math.random() * (list.length - 1))

  const item = useMemo(() => {
    return list[activeIndex]
    // const record = JSON.parse(list[activeIndex].data);
    // return {
    //   sentence: record.x7U5s161raUGRnnua7O48CRz81Q1elTK.value,
    //   nickName: record.GvWvFE2RLxv6dokKTFrPGEOaVXKpm4bT.value,
    // };
  }, [activeIndex, list])

  useEffect(() => {
    intervalRef.current = window.setTimeout(() => {
      onChange((activeIndex + 1) % list.length)
    }, 16000)
    return () => clearTimeout(intervalRef.current)
  }, [activeIndex, list.length, onChange])

  return (
    <div className="h-40 max-w-2xl px-8 lg:max-w-4xl">
      <div className="relative m-2  border-l-2 border-l-blue-600 pl-10 md:pl-8 ">
        <IconQuote className="absolute left-2 h-5 w-5 fill-current text-blue-600"></IconQuote>
        <p className="mt-2 text-xl font-medium text-gray-600 md:text-2xl">
          {item.sentence}
        </p>
      </div>
      shared with ❤ by {item.nickName}，
      <a
        href="https://www.yuque.com/forms/share/3f2f79b9-599c-462a-a487-47e3852a56d6"
        className="text-blue-500 underline "
      >
        我也来试试{' '}
      </a>
      留下一些句子，让别人感到温暖吧。{' '}
      <Link href={'/sentences'}>
        <a className="text-xs underline ">所有留言</a>
      </Link>
    </div>
  )
}
