import { SearchBox } from '@/components/SearchBox'
import { getProfessions } from '@/lib/service/profession'
import { Departments } from '../components/Departments'
import { APP_INTRODUCTION, APP_NAME } from '../constants/siteConfig'

export default async function Home() {
  const data = await getProfessions()

  return (
    <div className='grid grid-cols-12 gap-6 p-2 px-4'>
      <div className='col-span-12 space-y-4 py-6'>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-muted-800 dark:text-white">
        <span>{APP_NAME}</span>
        </h1>
        <p className="font-sans text-lg text-muted-500 dark:text-muted-400">
          <span className="text-muted-500 dark:text-muted-400"> {APP_INTRODUCTION}</span>
          </p>
      </div>
      <div className='ltablet:col-span-6 col-span-12 lg:col-span-6'>
      <SearchBox />
      </div>
      <div className="ltablet:col-span-6 col-span-12 lg:col-span-6">
        <Departments data={data}></Departments>
      </div>
    </div>
  )
}


