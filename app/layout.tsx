import '@/styles/globals.css'
export default function RootLayout({
  children,
  params,
  searchParams,
  router
}: {
  children: React.ReactNode
}) {
  console.log(params,router)
  return (
    <html>
      <head />
      <body>
        {/* {JSON.stringify(params)}
        {JSON.stringify(router)} */}

        <NewLayout>{children}</NewLayout>
      </body>
    </html>
  )
}

function NewLayout({ children }) {
  // tailwind 没生效
  function Header() {
    return (
      <header className="space-around sticky top-0 z-[10]  flex h-16 w-full  flex-row-reverse items-center border-b border-b-slate-200 text-slate-900 backdrop-blur-sm md:flex-row">
        <div className="hidden w-0 text-center md:block md:flex-1">
          {/* todo: 这个搜索框 */}
          {/* <Search
            iconClassName={'text-slate-400'}
            className="w-44 rounded text-sm ring-1 ring-slate-300 focus:ring-blue-400"
            onSubmit={(v) =>
              router.push({ pathname: '/search', query: { query: v } })
            }
            placeholder={'搜索'}
          /> */}
        </div>
        <div className="flex w-0 flex-1  justify-center gap-4 md:flex-[4]">
          <div
            id="headerContent"
            className="text-center text-2xl font-semibold text-slate-600"
          >
            {/* 绮课 */}
          </div>
        </div>
      </header>
    )
  }

  return (
    <div className="min-h-screen w-full   text-slate-800">
      <Header />
      <div className="grid w-full grid-cols-1 md:grid-cols-5">
        <Sidebar />
        <main className="col-span-4 h-full bg-slate-50 md:py-2 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  /* todo: 移动端改成菜单吧 */
  return (
    /* todo: 安卓 chrome 老是会有滚动条，不清楚跟这里是否有关系 */
    <aside className="top-16 col-span-1 row-span-4 hidden border-gray-200 md:sticky md:block md:h-[calc(100vh-4rem)] md:border-r md:p-4">
      <ul className="">
        {/* todo: 这里加一个搜索框 */}
        <li className="rounded  px-4 py-2 transition-all hover:scale-[102%] hover:bg-slate-100">
          收藏夹
        </li>
        <li className="rounded bg-slate-100 px-4 py-2 transition-all hover:scale-[102%] hover:bg-slate-100">
          课表查询
        </li>
        <li className="rounded px-4 py-2">【WIP】课程卡片制作</li>
      </ul>
      <p className="fixed bottom-0 p-4 text-sm">
        花野猫筑之以 ❤
        <br />
        赏他一碗米线
      </p>
    </aside>
  )
}
