import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Search from '../components/Search'
import Loading from '../components/Loading'
import { Quote as IconQuote } from '../components/Icons'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { useEffect, useMemo, useRef, useState } from 'react'
import { HeroDoodle } from '../components/HeroDoodle'
import { GithubLink } from '../components/GithubLink'

export default function Home({ data, test }) {
  const router = useRouter()
  const loading = useLinkTransition()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)

  const handleSearch = (v: string) => {
    router.push('/search/' + v)
  }

  const intervalRef = useRef(Math.random() * (data.data.length - 1))

  useEffect(() => {
    intervalRef.current = window.setTimeout(() => {
      setActive((active + 1) % data.data.length)
    }, 16000)
    return () => clearTimeout(intervalRef.current)
  }, [active, data.data.length])

  const item = useMemo(() => {
    const record = JSON.parse(data.data[active].data)
    return {
      sentence: record.x7U5s161raUGRnnua7O48CRz81Q1elTK.value,
      nickName: record.GvWvFE2RLxv6dokKTFrPGEOaVXKpm4bT.value,
    }
  }, [active, data.data])

  return (
    <>
      <Head>
        <title>绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center space-y-8 pb-12 text-center">
        <header className="fixed top-0 z-10  flex w-full border-b bg-white bg-opacity-70 backdrop-blur-lg backdrop-filter">
          <h1 className="mx-8 my-4 font-bold">
            <div className="relative inline-block text-blue-600">
              <span className="text-4xl lg:text-6xl">绮课</span>
              <span className="pl-2 text-2xl font-light text-gray-600">
                cheerTimetable
              </span>
            </div>
          </h1>
        </header>
        <HeroDoodle active={active} />
        <div className="mx-10 w-full items-center justify-center">
          <Search onSubmit={handleSearch} onChange={setQ}></Search>
          <button
            onClick={() => {
              handleSearch(q)
            }}
            className="ml-2 box-border select-none  items-center rounded-full border border-blue-500 px-5 align-middle text-sm leading-8 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            {loading ? <Loading size={'2rem'} /> : '搜索'}
          </button>
        </div>
        <div className="h-40 max-w-2xl px-8 lg:max-w-4xl">
          <div className="relative m-2  border-l-2 border-l-blue-600 pl-10 md:pl-8 ">
            <IconQuote className="absolute left-2 h-6 w-6 fill-current text-blue-600"></IconQuote>
            <p className="mt-2 text-xl font-medium text-gray-600 md:text-2xl">
              {item.sentence}
            </p>
          </div>
          shared with ❤ by {item.nickName}，
          <a
            href="https://www.yuque.com/forms/share/3f2f79b9-599c-462a-a487-47e3852a56d6"
            className="text-blue-500 underline "
          >
            我也来试试{' '}
          </a>
          留下一些句子，让别人感到温暖吧
        </div>
      </main>
      <footer className="backdrop-filte fixed bottom-0 flex h-16 w-full items-center justify-center border-t bg-white bg-opacity-70 backdrop-blur-lg">
        <GithubLink />
      </footer>
    </>
  )
}

export async function getStaticProps(context) {
  const data = await fetch(
    'https://www.yuque.com/api/tables/records?docId=70387138&docType=Doc&limit=2000&offset=0&sheetId=8gc2RfiVFTi1UOGGVxx64YaQyVSkGB2f'
  ).then((e) => e.json())

  // const test = await fetch(
  //   'https://www.yuque.com/api/tables/records?docId=70387138&docType=Doc&limit=2000&offset=0&sheetId=8gc2RfiVFTi1UOGGVxx64YaQyVSkGB2f',
  //   {
  //     headers: {
  //       'X-Auth-Token': 'PCXX69oELWB8NhlgeZBCflkdvpH9iQYcZ1TUPS5i',
  //     },
  //   }
  // ).then((e) => e.text())

  return {
    props: {
      data,
    },
    revalidate: 60 * 2,
  }
}
