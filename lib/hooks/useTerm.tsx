'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { CourseItem } from '../types/CourseItem'
import { useLayout } from 'contexts/layoutContext'

export function useTerm() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const sp = useSearchParams()
  const { title, terms } = useLayout()

  const activeTerm = pathname.match(/\d+\-\d+-\d+/)?.[0]
  const hasTermSearchParam = activeTerm

  const prefetchTerms = (terms) => {
    for (const term of terms) {
      setTimeout(() => {
        router.prefetch(
          !!activeTerm
            ? pathname.replace(/\d+\-\d+-\d+/, term)
            : pathname + '/' + term
        )
      }, 200)
    }
  }

  const navToTerm = (term) => {
    const targetURL = !!activeTerm
      ? pathname.replace(/\d+\-\d+-\d+/, term)
      : pathname + '/' + term
    router.replace(targetURL, { forceOptimisticNavigation: true })
  }
  return { navToTerm, activeTerm, hasTermSearchParam, prefetchTerms, terms }
}
