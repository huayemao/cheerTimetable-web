import { getProfessions } from '@/lib/service/getProfessions'
import { Departments } from '../components/Departments'
import { APP_INTRODUCTION, APP_NAME } from '../constants/siteConfig'

export default async function Home() {
  const data = await getProfessions()

  return (
    <div className='p-2 px-4'>
      <div className='space-y-4 py-6'>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-muted-800 dark:text-white">
        <span>{APP_NAME}</span>
        </h1>
        <p className="font-sans text-lg text-muted-500 dark:text-muted-400">
          <span className="text-muted-500 dark:text-muted-400"> {APP_INTRODUCTION}</span>
          </p>
      </div>
      <div className="h-full min-h-[80vh] w-full ">
        <Departments data={data}></Departments>
      </div>
    </div>
  )
}


