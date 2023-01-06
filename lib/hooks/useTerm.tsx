'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { CourseItem } from '../types/CourseItem'

export function useTerm() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const sp = useSearchParams()

  const activeTerm = sp.get('term')
  const hasTermSearchParam = !!sp.get('term')

  const prefetchTerms = (terms) => {
    for (const term of terms) {
      router.prefetch(
        pathname +
          '/?' +
          qs.stringify({
            term,
          })
      )
    }
  }

  const navToTerm = (term) => {
    const targetURL =
      pathname +
      '/?' +
      qs.stringify({
        term,
      })
    router.replace(targetURL, { forceOptimisticNavigation: true })
  }
  return { navToTerm, activeTerm, hasTermSearchParam, prefetchTerms }
}
