import { useRouter } from 'next/router'
import { Timetable, TimetableTitle } from 'components/Timetable'
import List from '../../components/List'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import Layout from 'components/Layout'
import Loading from 'components/Loading'
import Modal from 'components/Modal'
import Head from 'next/head'
import { keyBy, omit } from 'lodash'
import MappedTable from 'components/MappedTable'
import { searchOwner } from 'lib/api/searchOwner'
import Link from 'next/link'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { Location, Student, Subject, Teacher } from '@prisma/client'
import Select from 'components/Select'
import { OwnerType } from 'lib/types/Owner'
import { useEffect, useMemo } from 'react'
import { SearchResult } from '../../components/SearchResult'

import { Listbox } from '@headlessui/react'
import { getAllDepartments } from '../../lib/api/getAllDepartments'
import useSWR from 'swr'
import { useSubjects } from 'lib/hooks/useSubjects'
import { DepartmentSelect } from '../../components/DepartmentSelect'
import { Pagination } from '../../components/Pagination'
import { SubjectPreview } from 'components/SubjectPreview'

const PAGE_SIZE = 20

function Subjects({ name, departments }: { name: any; departments: any[] }) {
  const loading = useLinkTransition()

  const router = useRouter()

  const { type, pageNum, departmentName } = router.query

  const title = `所有课程`

  const { list, totalCount, isLoading, isError } = useSubjects(
    { departmentName: departmentName as string },
    {
      pageSize: PAGE_SIZE,
      offset: ((Number(pageNum as string) || 1) - 1) * PAGE_SIZE,
    }
  )

  return (
    <Layout
      extraNavBarChildren={
        <h2 className="text-xl font-thin text-blue-500">{title}</h2>
      }
      sidebarContent={<DepartmentSelect departments={departments} />}
    >
      <Head>
        <title>{title}-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-8 lg:px-12">
        {(isLoading || router.isFallback) && 'loading...'}
        {!isLoading &&
          list.map((e: Subject, i) => (
            <SubjectPreview key={e.id} subject={e}></SubjectPreview>
          ))}
      </div>
      {!isLoading && list.length && (
        <Pagination pageCount={Math.ceil(totalCount / PAGE_SIZE)} />
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const departments = await getAllDepartments()

  return {
    props: {
      departments,
    },
    revalidate: 60 * 60 * 96,
  }
}

export default Subjects
