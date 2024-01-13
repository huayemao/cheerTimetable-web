'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useTerm() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const sp = useSearchParams()

  const activeTerm = pathname.match(/\d+\-\d+-\d+/)?.[0]
  const hasTermSearchParam = activeTerm

  const prefetchTerms = (terms) => {
    for (const term of terms) {
      setTimeout(() => {
        router.prefetch(
          !!activeTerm
            ? pathname.replace(/\d+\-\d+-\d+/, term) + '?' + sp?.toString()
            : pathname + '/' + term
        )
      }, 200)
    }
  }

  const navToTerm = (term) => {
    const targetURL = !!activeTerm
      ? pathname.replace(/\d+\-\d+-\d+/, term) + '?' + sp?.toString()
      : pathname + '/' + term
    router.replace(targetURL)
  }
  return { navToTerm, activeTerm, hasTermSearchParam, prefetchTerms }
}
