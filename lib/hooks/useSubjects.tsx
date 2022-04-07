import { fetcher } from 'lib/fetcher'
import useSWR from 'swr'
import { URLSearchParams } from 'url'
import qs from 'qs'

type SubjectFilters = {
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

  const [list, totalCount] = data || []

  return {
    list,
    totalCount,
    isLoading: !error && !data,
    isError: error,
  }
}
