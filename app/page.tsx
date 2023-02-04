import {
  APP_NAME,
  APP_DESCRIPTION,
  AUTHOR,
  KEY_WORDS,
} from '../constants/siteConfig'

export default function Home() {
  return (
    <div>
      <h1>{APP_NAME}</h1>
      <p>{APP_DESCRIPTION}</p>
      <div className="flex h-full min-h-[80vh] w-full items-center justify-center">
        <div className="w-96 rounded-lg bg-white p-2 shadow ring-1 ring-slate-700/5 dark:bg-slate-900 dark:ring-white/10">
          <div className="grid grid-cols-5 gap-2">
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 flex aspect-square items-center justify-center rounded-sm bg-indigo-200 text-3xl font-bold text-indigo-500 ring-1 ring-inset ring-slate-900/5 dark:ring-0">
              1
            </div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
            <div className="pt-full dark:highlight-white/10 aspect-square rounded-sm bg-indigo-50 ring-1 ring-inset ring-slate-900/5 dark:ring-0"></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-slate-500">
            <span className="flex-1">test</span>
            <svg width="47" height="4" viewBox="0 0 47 4" fill="currentColor">
              <circle
                cx="1.5"
                cy="2"
                r="1.5"
                className="text-slate-200 dark:text-slate-800"
              ></circle>
              <circle
                cx="12.5"
                cy="2"
                r="1.5"
                className="text-slate-300 dark:text-slate-700"
              ></circle>
              <circle
                cx="23.5"
                cy="2"
                r="1.5"
                className="text-slate-400 dark:text-slate-600"
              ></circle>
              <circle
                cx="34.5"
                cy="2"
                r="1.5"
                className="text-slate-300 dark:text-slate-700"
              ></circle>
              <circle
                cx="45.5"
                cy="2"
                r="1.5"
                className="text-slate-200 dark:text-slate-800"
              ></circle>
            </svg>
            <span className="flex-1 text-right">blue-900</span>
          </div>
        </div>
      </div>
    </div>
  )
}
