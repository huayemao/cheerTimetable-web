import { useRouter } from 'next/router'
import { Timetable, TimetableTitle } from 'components/Timetable'
import List from '../../components/List'
import useMediaQuery from 'lib/hooks/useMediaQuery'
import Layout from 'components/Layout'
import Loading from 'components/Loading'
import Container from 'components/Container'
import Modal from 'components/Modal'
import Head from 'next/head'
import { keyBy, omit } from 'lodash'
import { SideBar } from 'components/SideBar'
import MappedTable from 'components/MappedTable'
import { getFieldDetail } from 'lib/api/getFieldDetail'
import Link from 'next/link'
import useLinkTransition from 'lib/hooks/useLinkTransition'

function SearchPage({ data, name }) {
  const omitFields = ['序号', '年级', '单位名称', '专业名称', '学号', '性别']
  const loading = useLinkTransition()

  const router = useRouter()

  const title = router.isFallback ? '搜索结果' : `${name}的搜索结果`

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
      <Container>
        {router.isFallback ? (
          <div className="flex h-full items-center justify-center">
            <Loading size={60} />
          </div>
        ) : data.length ? (
          <MappedTable
            data={data}
            propertyNames={Object.keys(data[0]).filter(
              (e) => !omitFields.includes(e)
            )}
            customCell={({ propertyName, value, item }) =>
              propertyName === '姓名' && item.年级 > '2016' ? (
                <Link href={`/curriculum/student/${item.学号}`}>
                  <a className="text-blue-500 transition duration-75">
                    {value}
                  </a>
                </Link>
              ) : (
                value
              )
            }
          ></MappedTable>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            没有搜索到这位同学哦
          </div>
        )}
      </Container>
      {loading && (
        <Modal showCloseButton={false}>
          <Loading size={60}></Loading>
        </Modal>
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { name } = context.params
  const data = await getFieldDetail(name)

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
