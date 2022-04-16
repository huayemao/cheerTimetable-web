import { useRouter } from 'next/router'
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
import { Location, Student, Subject, Teacher } from '@prisma/client'
import Select from 'components/common/Select'
import { OwnerType } from 'lib/types/Owner'
import { useEffect, useMemo } from 'react'
import { SearchResult } from '../../components/SearchResult'

import { Listbox, Switch } from '@headlessui/react'
import { getAllDepartments } from '../../lib/api/getAllDepartments'
import useSWR from 'swr'
import { useSubjects } from 'lib/hooks/useSubjects'
import { DepartmentSelect } from '../../components/DepartmentSelect'
import { Pagination } from '../../components/common/Pagination'
import { SubjectPreview } from 'components/SubjectPreview'
import Search from 'components/Search'

const PAGE_SIZE = 20

const PublicElectiveCourseToggler = () => {
  const router = useRouter()
  const { publicElectiveOnly: publicElectiveOnlyRaw } = router.query
  const publicElectiveOnly = publicElectiveOnlyRaw === 'true'

  return (
    <Switch
      checked={publicElectiveOnly}
      onChange={(v) => {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              publicElectiveOnly: v ? 'true' : 'false',
              pageNum: 1,
            },
          },
          undefined,
          { shallow: true }
        )
      }}
      className={`${publicElectiveOnly ? 'bg-blue-500' : 'bg-blue-200'}
    relative inline-flex h-[24px] w-[48px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">只看公选课</span>
      <span
        aria-hidden="true"
        className={`${publicElectiveOnly ? 'translate-x-6' : 'translate-x-0'}
      pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}

const Filters = ({ credits = [], departments }) => (
  <>
    <fieldset>
      <legend className="block w-full  font-medium">只看公选课</legend>
    </fieldset>
    <PublicElectiveCourseToggler></PublicElectiveCourseToggler>

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

  const router = useRouter()

  const { type, pageNum, departmentName, q, publicElectiveOnly } = router.query

  const title = `${departmentName ? departmentName + '开设的' : '所有'}课程`

  const { list, totalCount, credits, isLoading, isError } = useSubjects(
    {
      departmentName: departmentName as string,
      q: q as string,
      publicElectiveOnly: publicElectiveOnly as string,
    },
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
              router.replace({
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
      menuItems={
        <>
          <Filters departments={departments} credits={credits}></Filters>
        </>
      }
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
          {list.length ? (
            <Pagination pageCount={Math.ceil(totalCount / PAGE_SIZE)} />
          ) : (
            '好像什么也没有呀'
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
