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
import { Location, Student, Teacher } from '@prisma/client'
import Select from 'components/Select'
import { OwnerType } from 'lib/types/Owner'
import { useMemo } from 'react'
import { SearchResult } from '../../components/SearchResult'

function SearchPage({
  data,
  name,
}: {
  name: any
  data: [Student[], Teacher[], Location[]]
}) {
  const loading = useLinkTransition()

  const router = useRouter()

  const { type, name: paramName } = router.query

  const title = router.isFallback
    ? '搜索结果'
    : `${decodeURIComponent(paramName as string)}的搜索结果`

  return (
    <Layout
      extraNavBarChildren={
        <h2 className="text-xl font-thin text-blue-500">{title}</h2>
      }
    >
      <Head>
        <title>{title}-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchResult data={data} />
      {loading && (
        <Modal showCloseButton={false} title="loading">
          <Loading size={60}></Loading>
        </Modal>
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { name } = context.params
  const data = await searchOwner(name)

  return {
    props: {
      name,
      data,
    },
    revalidate: 60 * 60 * 96,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      name: '王皓',
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: true }
}

export default SearchPage
