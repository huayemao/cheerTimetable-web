import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Search from '../components/Search'
import Loading from '../components/Loading'
import useLinkTransition from 'lib/hooks/useLinkTransition'
import { useState } from 'react'
import 'css-doodle'

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
      <main className="flex w-full flex-1 flex-col items-center justify-center text-center">
        <div
          className="mb-4 -mt-20 h-32 w-64 overflow-hidden border border-slate-50 lg:-mt-32 lg:h-48 lg:w-80"
          dangerouslySetInnerHTML={{
            __html: `<css-doodle click-to-update class="doodle">
            :doodle {
           @grid: 10 / 40em;
           grid-gap: .4em;
            }
           
           --hue: calc(217 + .5 * @row() * @col());
               background: hsla(var(--hue), 91%, 50%, @r(.1, .9));
           clip-path: ellipse(100% 100% at @pick('0 0', '0 100%', '100% 0', '100% 100%'));
           </css-doodle>`,
          }}
        ></div>
        <h1 className="relative mx-20 text-6xl font-bold">
          Welcome to{' '}
          <div className="relative inline-block text-blue-600">
            <span className="relative">绮课!</span>
          </div>
        </h1>

        <div className="mx-10 mt-4 w-full items-center justify-center">
          <Search onSubmit={handleSearch} onChange={setQ}></Search>
          <button
            onClick={() => {
              handleSearch(q)
            }}
            className="ml-2 select-none items-center rounded-full border border-blue-500 px-5 text-sm leading-8 text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none"
          >
            {loading ? <Loading size={'2rem'} /> : '搜索'}
          </button>
        </div>
      </main>
    </div>
  )
}
