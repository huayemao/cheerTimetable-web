import getCourseById from '@/lib/service/getCourseById'

export default async function Head({ params }) {
  const { id } = params
  const course = await getCourseById(id)

  return (
    <>
      <title>{`${course?.subject.name}@${course?.term}`}</title>
    </>
  )
}
