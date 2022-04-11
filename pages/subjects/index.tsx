import { useRouter } from 'next/router'
import { Timetable, TimetableTitle } from 'components/Timetable'
import List from '../../components/common/List'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import Layout from 'components/common/Layout'
import Loading from 'components/Loading'
import Modal from 'components/common/Modal'
import Head from 'next/head'
import { keyBy, omit } from 'lodash'
import MappedTable from 'components/MappedTable'
import { searchOwner } from 'lib/api/searchOwner'
import Link from 'next/link'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { Location, Student, Subject, Teacher } from '@prisma/client'
import Select from 'components/common/Select'
import { OwnerType } from 'lib/types/Owner'
import { useEffect, useMemo } from 'react'
import { SearchResult } from '../../components/SearchResult'

import { Listbox } from '@headlessui/react'
import { getAllDepartments } from '../../lib/api/getAllDepartments'
import useSWR from 'swr'
import { useSubjects } from 'lib/hooks/useSubjects'
import { DepartmentSelect } from '../../components/DepartmentSelect'
import { Pagination } from '../../components/common/Pagination'
import { SubjectPreview } from 'components/SubjectPreview'
import Search from 'components/Search'

const PAGE_SIZE = 20

const Filters = ({ credits = [], departments }) => (
  <>
    {/* <fieldset>
      <legend className="block w-full  font-medium">学分</legend>
    </fieldset> */}
    {/* <div className="grid grid-cols-4 gap-2">
      {credits.map((e) => (
        <div key={e} className="flex items-center">
          <input
            id={e}
            type="checkbox"
            name={`credits${e}`}
            className="h-5 w-5 rounded border-gray-300"
          />
          <label
            htmlFor="3+"
            className="ml-2 text-sm font-medium text-gray-600"
          >
            {e}
          </label>
        </div>
      ))}
    </div> */}
    <fieldset>
      <legend className="block w-full  font-medium">开设院系</legend>
    </fieldset>
    <DepartmentSelect departments={departments} />
  </>
)

function Subjects({ name, departments }: { name: any; departments: any[] }) {
  const loading = useLinkTransition()

  const router = useRouter()

  const { type, pageNum, departmentName, q } = router.query

  const title = `${departmentName ? departmentName + '开设的' : '所有'}课程`

  const { list, totalCount, credits, isLoading, isError } = useSubjects(
    { departmentName: departmentName as string, q: q as string },
    {
      pageSize: PAGE_SIZE,
      offset: ((Number(pageNum as string) || 1) - 1) * PAGE_SIZE,
    }
  )

  return (
    <Layout
      extraNavBarChildren={
        <>
          <h2 className="hidden text-xl font-thin text-blue-500 lg:block">
            {title}
          </h2>
          <Search
            defaultValue={q ? decodeURIComponent(q as string) : ''}
            onSubmit={(v) =>
              router.push({
                pathname: router.pathname,
                query: { ...router.query, q: v, pageNum: 1 },
              })
            }
          />
        </>
      }
      sidebarContent={
        <>
          <Filters departments={departments} credits={credits}></Filters>
        </>
      }
      menuItems={<DepartmentSelect departments={departments} />}
    >
      <Head>
        <title>{title}-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loading size={50} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-8 lg:px-12">
            {list.map((e: Subject, i) => (
              <SubjectPreview key={e.id} subject={e}></SubjectPreview>
            ))}
          </div>
          {list.length && (
            <Pagination pageCount={Math.ceil(totalCount / PAGE_SIZE)} />
          )}
        </>
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
