import { getNameById, getTimeTable } from '../../../lib/api'
import { Timetable, TimetableTitle } from '../../../components/Timetable'
import useMediaQuery from '../../../lib/hooks/useMediaQuery'
import Layout from '../../../components/Layout'
import Container from '../../../components/Container'
import Modal from '../../../components/Modal/Modal'

const Filters = () => (
  <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
    <ul>
      <li className="text-accent-4 hover:bg-accent-1 hover:text-accent-8 focus:bg-accent-1 focus:text-accent-8 block text-sm leading-5 focus:outline-none lg:text-base lg:font-bold lg:tracking-wide lg:no-underline lg:hover:bg-transparent">
        <div className="block px-4 py-2 lg:my-2 lg:mx-4 lg:inline-block lg:p-0">
          学期
        </div>
      </li>
      {['2021-2022-1', '2021-2022-2'].map((e) => (
        <li className="text-accent-4 hover:bg-accent-1 hover:text-accent-8 focus:bg-accent-1 focus:text-accent-8 block whitespace-nowrap text-sm leading-5 hover:underline focus:outline-none lg:hover:bg-transparent">
          <a
            className="block px-4 py-2 lg:my-2 lg:mx-4 lg:inline-block lg:p-0"
            href=""
          >
            {e}
          </a>
        </li>
      ))}
    </ul>
  </div>
)

export default function ({ data, ownerType, ownerName }) {
  const isNotMobile = useMediaQuery('(min-width: 768px)', true, false)
  return (
    <Layout>
      <Container>
        <div className="flex justify-center">
          <TimetableTitle ownerName={ownerName} ownerType={ownerType} />
        </div>
        <div className="flex">
          {isNotMobile && <Filters />}
          <Timetable data={data} show7days={isNotMobile}></Timetable>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { id, type } = context.params

  const { data, rawUrl } = await getTimeTable(type, id)

  const typeMapping = {
    student: '学生',
    teacher: '教职工',
    location: '授课地点',
  }
  const ownerType = typeMapping[type]

  const ownerName = getNameById(type, id)

  return {
    props: {
      data,
      ownerType,
      ownerName,
      rawUrl,
    },
    revalidate: 60 * 60 * 24,
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
