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
import { TermSelect } from 'components/TermSelect'
import { getFieldDetail } from 'lib/api/getFieldDetail'
import Link from 'next/link'

function SearchPage({ data }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  // console.log(props)

  return (
    <div>
      <MappedTable
        data={data}
        customCell={({ propertyName, value, item }) =>
          propertyName === '姓名' ? (
            <Link href={`/curriculum/student/${item.学号}`}>
              <a className="group flex w-full items-center rounded-lg p-1 pl-4 font-normal transition duration-75">
                {value}
              </a>
            </Link>
          ) : (
            value
          )
        }
      ></MappedTable>
    </div>
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
