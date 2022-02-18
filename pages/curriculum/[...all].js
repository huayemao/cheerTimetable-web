import { useRouter } from 'next/router'
import Link from 'next/link'
import { getNameById, getTimeTable } from '../../lib/api'
import { Timetable, TimetableTitle } from '../../components/Timetable'
import useMediaQuery from '../../lib/hooks/useMediaQuery'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import Modal from '../../components/Modal/Modal'
import Head from 'next/head'
import { keyBy } from 'lodash'
import { TERMS } from '../../constants'
import { SideBar } from '../../components/SideBar'

const Filters = () => {
  const router = useRouter()
  const [type, id, term] = router.query.all
  return (
    <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      <ul>
        {TERMS.map((e) => (
          <li
            key={e}
            className="focus:bg-accent-1 focus:text-accent-8 block whitespace-nowrap text-sm leading-5 text-gray-400 hover:text-gray-600 focus:outline-none lg:hover:bg-transparent"
          >
            <Link
              // shallow
              href={`/curriculum/${type}/${id}/${e}`}
            >
              <a
                className={
                  'block px-4 py-2 lg:my-2 lg:mx-4 lg:inline-block lg:p-0' +
                  (term === e ? ' text-gray-600' : '')
                }
              >
                {e}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TimetablePage(props) {
  const router = useRouter()

  const term = router.query.all[2] || '2021-2022-2'
  return (
    <Layout>
      <Head>
        <title>{props.ownerName}的课表-绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <div className="grid grid-cols-5 ">
          <SideBar></SideBar>
          <div className="col-span-5 flex  h-screen flex-col items-center overflow-y-auto py-2 lg:col-span-4">
            {process.browser && <Content {...props}></Content>}
          </div>
        </div>
      </Container>
    </Layout>
  )
}

function Content({ ownerName, ownerType, data }) {
  const isNotMobile = useMediaQuery('(min-width: 768px)', true, false)
  return (
    <>
      <TimetableTitle ownerName={ownerName} ownerType={ownerType} />
      <Timetable data={data} show7days={isNotMobile}></Timetable>
    </>
  )
}

export async function getStaticProps(context) {
  const { all } = context.params
  const [type, id, term = '2021-2022-2'] = all

  const data = await Promise.all(
    [term].map((term) => getTimeTable(type, id, term))
  )
  const timetables = Object.fromEntries(data.map((e, i) => [[term][i], e]))

  const typeMapping = {
    student: '学生',
    teacher: '教职工',
    location: '授课地点',
  }
  const ownerType = typeMapping[type]

  const ownerName = getNameById(type, id)

  return {
    props: {
      data: timetables[term].data,
      ownerType,
      ownerName,
    },
    revalidate: 60 * 60 * 48,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      all: ['student', '8305180722'],
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: 'blocking' }
}

export default TimetablePage
