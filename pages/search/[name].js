import { useRouter } from 'next/router'
import { Timetable, TimetableTitle } from 'components/Timetable'
import List from '../../components/List'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import Layout from 'components/Layout'
import Container from 'components/Container'
import Modal from 'components/Modal/Modal'
import Head from 'next/head'
import { keyBy } from 'lodash'
import { SideBar } from 'components/SideBar'
import MappedTable from 'components/MappedTable'
import { getFieldDetail } from 'lib/api/getFieldDetail'
import Link from 'next/link'

function SearchPage({ data }) {
  const router = useRouter()
  const name = decodeURIComponent(router.query.name)

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  // console.log(props)

  return (
    <Layout
      extraNavBarChildren={
        <h2 className="text-xl font-thin text-blue-500">{name}的搜索结果</h2>
      }
    >
      <Head>
        <title>{name}的搜索结果-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <MappedTable
          data={data}
          customCell={({ propertyName, value, item }) =>
            propertyName === '姓名' && item.年级 > '2016' ? (
              <Link href={`/curriculum/student/${item.学号}`}>
                <a className="text-blue-500 transition duration-75">{value}</a>
              </Link>
            ) : (
              value
            )
          }
        ></MappedTable>
      </Container>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { name } = context.params
  const data = await getFieldDetail(name)

  return {
    props: {
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
