import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/solid'

const nav =
  (router, pageNum = 1, forward) =>
  () => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          pageNum: forward ? Number(pageNum) + 1 : Number(pageNum) - 1,
        },
      },
      undefined,
      { shallow: true }
    )
  }

export function Pagination({ pageCount }) {
  const router = useRouter()
  const { pageNum: pageNumRaw } = router.query

  const pageNum = Number(pageNumRaw as string)

  const [begin, setBegin] = useState(pageNum - 5 > 0 ? pageNum - 5 : 0)

  const nums = Array.from({ length: pageCount }, (e, i) => i + 1)

  const navNext = nav(router, pageNum, true)
  const navPrev = nav(router, pageNum, false)

  return (
    <ol className="flex justify-center space-x-1 text-xs font-medium">
      {(pageNum && pageNum !== 1 && (
        <li onClick={navPrev}>
          <a className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100">
            <ChevronLeftIcon className="h-3 w-3" />
          </a>
        </li>
      )) ||
        undefined}

      {nums.slice(begin, begin + 10).map((e, i) => (
        <li key={e}>
          <Link
            href={{
              query: { ...router.query, pageNum: e },
              pathname: router.pathname,
            }}
            shallow
            className={
              'inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 leading-8' +
                ((pageNum ? pageNum === e : e === 1) &&
                  ' border-blue-600 bg-blue-600 text-white') || ''
            }
          >
            {e}
          </Link>
        </li>
      ))}

      {pageNum !== Number(pageCount) && (
        <li>
          <a
            onClick={navNext}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100"
          >
            <ChevronRightIcon className="h-3 w-3" />
          </a>
        </li>
      )}
    </ol>
  )
}
