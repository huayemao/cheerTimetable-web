import { fetcher } from 'lib/fetcher'
import useSWR from 'swr'
import { URLSearchParams } from 'url'
import qs from 'qs'

type SubjectFilters = {
  q: string
  departmentName: string
}

type PageInfo = {
  offset: number
  pageSize: number
}

export function useSubjects(filters: SubjectFilters, pageInfo: PageInfo) {
  const { data, error } = useSWR(
    `/api/subjects?${qs.stringify({ ...filters, ...pageInfo })}`,
    fetcher
  )

  const [list, totalCount, credits] = data || []

  return {
    list,
    totalCount,
    credits,
    isLoading: !error && !data,
    isError: error,
  }
}
