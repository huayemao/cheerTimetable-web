import { getNameById, getTimeTable } from '../../../lib/api'
import { Timetable, TimetableTitle } from '../../../components/Timetable'
import useMediaQuery from '../../../lib/hooks/useMediaQuery '

export default function ({ data, ownerType, ownerName }) {
  const show7days = useMediaQuery('(min-width: 768px)', true, false)
  return (
    <>
      <TimetableTitle ownerName={ownerName} ownerType={ownerType} />
      <Timetable data={data} show7days={show7days}></Timetable>
    </>
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
