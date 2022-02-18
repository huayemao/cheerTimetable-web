import { useRouter } from 'next/router'
import Link from 'next/link'
import { getNameById, getTimeTable } from '../../../lib/api'
import { Timetable, TimetableTitle } from '../../../components/Timetable'
import useMediaQuery from '../../../lib/hooks/useMediaQuery'
import Layout from '../../../components/Layout'
import Container from '../../../components/Container'
import Modal from '../../../components/Modal/Modal'
import Head from 'next/head'
import { keyBy } from 'lodash'
import { TERMS } from '../../../constants'

const Filters = () => {
  const router = useRouter()
  return (
    <div
      className=""
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <ul>
        {TERMS.map((e) => (
          <li
            key={e}
            className="text-accent-4 hover:bg-accent-1 hover:text-accent-8 focus:bg-accent-1 focus:text-accent-8 block whitespace-nowrap text-sm leading-5 hover:underline focus:outline-none lg:hover:bg-transparent"
          >
            <Link
              shallow
              href={{
                pathname: router.asPath.split('?')[0],
                query: { term: e },
              }}
            >
              <a className="block px-4 py-2 lg:my-2 lg:mx-4 lg:inline-block lg:p-0">
                {e}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TimetablePage({ timetables, ownerType, ownerName }) {
  const router = useRouter()

  const term = router.query.term || '2021-2022-2'
  const { data } = timetables[term]
  const isNotMobile = useMediaQuery('(min-width: 768px)', true, false)
  return (
    <Layout>
      <Head>
        <title>{ownerName}的课表-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Container> */}
      <div className="grid grid-cols-5 ">
        {isNotMobile && (
          <div className="bg-slate-50 p-2">
            <Link href={'/'}>
              <a className="ml-4 text-2xl text-blue-400 hover:text-blue-500">绮课</a>
            </Link>
            <Filters />
          </div>
        )}
        <div className="col-span-4 flex h-screen flex-col items-center overflow-y-auto py-2">
          <TimetableTitle ownerName={ownerName} ownerType={ownerType} />
          <Timetable data={data} show7days={isNotMobile}></Timetable>
        </div>
      </div>
      {/* </Container> */}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { id, type } = context.params
  console.log(context)

  const data = await Promise.all(
    TERMS.map((term) => getTimeTable(type, id, term))
  )
  const timetables = Object.fromEntries(data.map((e, i) => [TERMS[i], e]))

  const typeMapping = {
    student: '学生',
    teacher: '教职工',
    location: '授课地点',
  }
  const ownerType = typeMapping[type]

  const ownerName = getNameById(type, id)

  return {
    props: {
      timetables,
      ownerType,
      ownerName,
    },
    revalidate: 60 * 60 * 48,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      id: '8305180722',
      type: 'student',
    },
    {
      id: '8305180701',
      type: 'student',
    },
    {
      id: '8305180702',
      type: 'student',
    },
    {
      id: '8305180703',
      type: 'student',
    },
    {
      id: '8305180704',
      type: 'student',
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: 'blocking' }
}

export default TimetablePage
