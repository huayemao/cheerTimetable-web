import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Search from '../components/Search'
import Loading from '../components/Loading'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const loading = useLinkTransition()
  const [q, setQ] = useState('')

  const handleSearch = (v: string) => {
    fetch('/api/searchMetaByName?q=' + v + '&type=student')
      .then((res) => res.json())
      .then((students) => {
        if (students.length === 1) {
          const [s] = students
          router.push('/curriculum/student/' + s.xs0101id)
        } else if (students.length > 1) {
          router.push('/search/' + v)
        } else {
          alert('没有找到这个人哟')
        }
      })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center  text-center">
        <h1 className="mx-20 text-6xl font-bold">
          Welcome to{' '}
          <Link href="/">
            <a className="text-blue-600">绮课!</a>
          </Link>
        </h1>

        <div className="mt-3 flex w-full items-center justify-center">
          <Search onSubmit={handleSearch} onChange={setQ}></Search>
          <button
            onClick={() => {
              handleSearch(q)
            }}
            className="mx-2 select-none items-center rounded-full border border-blue-500 px-5 text-sm leading-8 text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none"
          >
            {loading ? <Loading size={'2rem'} /> : '搜索'}
          </button>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="ml-2 h-4" />
        </a>
      </footer>
    </div>
  )
}
