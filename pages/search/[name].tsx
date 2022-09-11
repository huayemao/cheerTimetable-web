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
import { Location, Student, Teacher } from '@prisma/client'
import Select from 'components/common/Select'
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
  const router = useRouter()

  const { type, name: paramName } = router.query

  const title = router.isFallback
    ? '搜索结果'
    : `${decodeURIComponent(paramName as string)}的搜索结果`

  return (
    <Layout title={title}>
      {(!router.isFallback || (router.isFallback && router.isReady)) && (
        <SearchResult data={data} />
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
      data: JSON.parse(JSON.stringify(data)),
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
