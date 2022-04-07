import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'

export function Pagination({ pageCount }) {
  const [begin, setBegin] = useState(0)
  const router = useRouter()
  const { pageNum } = router.query
  return (
    <ol className="flex justify-center space-x-1 text-xs font-medium">
      <li
        onClick={() =>
          pageNum &&
          pageNum !== '1' &&
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                pageNum: Number(pageNum) - 1,
              },
            },
            undefined,
            { shallow: true }
          )
        }
      >
        <a className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </li>

      {Array.from({ length: pageCount })
        .slice(begin, begin + 10)
        .map((e, i) => (
          <li key={i + 1}>
            <Link
              href={{
                query: { ...router.query, pageNum: i + 1 },
                pathname: router.pathname,
              }}
              shallow
            >
              <a
                className={
                  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 leading-8' +
                    ((router.query.pageNum
                      ? Number(router.query.pageNum) === i + 1
                      : i === 0) &&
                      ' border-blue-600 bg-blue-600 text-white') || ''
                }
              >
                {i + 1}
              </a>
            </Link>
          </li>
        ))}

      <li>
        <a className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </li>
    </ol>
  )
}
