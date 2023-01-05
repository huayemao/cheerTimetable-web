'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { CourseItem } from '../types/CourseItem'

export function useTerm(courses: CourseItem[]) {
  const terms = Array.from(new Set(courses?.map((e) => e.term)))?.sort(
    (a: string, b: string) => b.localeCompare(a)
  ) as string[]

  const router = useRouter()
  const pathname = usePathname() || ''
  const sp = useSearchParams()

  const activeTerm = sp.get('term') || terms[0]
  const hasTermSearchParam = !!sp.get('term')

  const navToTerm = (term = terms[0]) => {
    const targetURL =
      pathname +
      '/?' +
      qs.stringify({
        term,
      })
    router.replace(targetURL)
  }
  return { navToTerm, activeTerm, hasTermSearchParam, terms }
}
