import { useRouter } from 'next/router'
import React from 'react'

export default function Search() {
  const router = useRouter()
  const handleSearch = (v) => {
    fetch('/api/searchMetaByName?q=' + v + '&type=student')
      .then((res) => res.json())
      .then((students) => {
        if (students.length === 1) {
          const [s] = students
          router.push('/curriculum/student/' + s.xs0101id)
        }
      })
  }
  return (
    <div
      id="search"
      className="dropdown relative z-50 mt-10 inline-block text-left"
    >
      <i className="icon icon-search absolute left-3.5 top-2.5 text-slate-500 dark:text-slate-300"></i>
      <input
        onKeyDown={(e) => {
          if (event.keyCode == '13') {
            handleSearch(e.target.value)
          }
        }}
        onSubmit={(e) => {
          handleSearch(e.target.value)
        }}
        className="rounded-l-xl rounded-t-xl border border-slate-200 bg-slate-200 p-2 pl-11 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
        placeholder="搜索学生"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength="32"
        type="text"
        enterKeyHint="go"
      />
    </div>
  )
}
