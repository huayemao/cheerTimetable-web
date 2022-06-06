import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Search from '../components/Search'
import Loading from '../components/Loading'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { memo, useCallback, useState } from 'react'
import { GithubIcon, GithubLink } from '../components/Links/GithubLink'
import { Header } from '../components/Header'
import { WordsOfTenderness } from '../components/WordsOfTenderness'
import { YuqueIcon } from 'components/Links/YuequeLink'
import { NavPanel } from '../components/NavPanel'
import dynamic from 'next/dynamic'
import { QueryToolSelectDropDown } from './queryTool'
import { getSentences } from '../lib/getSentences'

const HeroDoodle = dynamic(() => import('../components/HeroDoodle'), {
  ssr: false,
  loading: () => <p>...</p>,
})

export default function Home({ sentences }) {
  const router = useRouter()
  const loading = useLinkTransition()
  const [q, setQ] = useState('')
  const [activeIndex, setActiveIndex] = useState(
    Math.ceil(Math.random() * (sentences.length - 1))
  )

  const { queryTool } = router.query
  const url = queryTool && decodeURIComponent(queryTool as string)

  const handleSearch = useCallback(
    (v: string) => {
      if (url) {
        router.push(url + v)
      } else {
        router.push('/search/' + v)
      }
    },
    [router, url]
  )

  const handleBtnClick = useCallback(
    (q) => {
      handleSearch(q)
    },
    [handleSearch]
  )

  const handleActiveIndexChange = useCallback(setActiveIndex, [setActiveIndex])

  return (
    <>
      <Head>
        <title>绮课</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center space-y-8 pb-12 text-center">
        <Header />
        <HeroDoodle seed={activeIndex} />
        <div className="mx-10 w-full items-center justify-center">
          <Search
            onSubmit={handleSearch}
            onChange={setQ}
            placeholder={'学生、教师、教室'}
            dropDownBtn={<QueryToolSelectDropDown />}
          />
          <button
            onClick={handleBtnClick.bind(null, q)}
            className="ml-2 box-border select-none  items-center rounded-full border border-blue-500 px-5 align-middle text-sm leading-8 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            {loading ? <Loading size={'2rem'} /> : '搜索'}
          </button>
        </div>
        <WordsOfTenderness
          list={sentences}
          onChange={handleActiveIndexChange}
          activeIndex={activeIndex}
        ></WordsOfTenderness>
        <NavPanel />
      </main>
      <footer className="backdrop-filte fixed bottom-0 flex h-16 w-full items-center justify-center  border-t bg-white bg-opacity-70 font-light text-gray-500 backdrop-blur-lg">
        <GithubLink />
        &emsp;|&emsp;QQ交流群 1157682866
      </footer>
    </>
  )
}

export async function getStaticProps(context) {
  const sentences = await getSentences()

  return {
    props: {
      sentences,
    },
    revalidate: 30,
  }
}

