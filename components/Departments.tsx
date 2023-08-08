"use client"
import OffCanvas from '@/components/common/OffCanvas';
import clsx from 'clsx';
import { Dictionary } from 'lodash';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export function Departments({ data }: {
  data: Dictionary<{
    facultyName: string;
    professionName: string;
  }[]>;
}) {

  const sp = useSearchParams()
  const params = Object.fromEntries(sp?.entries()||[]) 
  const router = useRouter()
  
  const handleBack = ()=>{
    if(!!params.department)
    router.back()
  }


  return <>
    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(data).map(([key, value], i) => {
        return (
          <div
            key={key}
            className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex w-full items-center  gap-3 rounded-xl border bg-white p-3 transition-all duration-300"
          >
            <div className={clsx("bg-info-500/20 text-info-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", {
              'text-rose-500 bg-rose-500/20': key.charCodeAt(0) % 4 == 0,
              'text-violet-500 bg-violet-500/20': key.charCodeAt(0) % 4 == 1,
              'text-cyan-500 bg-cyan-500/20': key.charCodeAt(0) % 4 == 2,
              'text-teal-500 bg-teal-500/20': key.charCodeAt(0) % 4 == 3,
            })}>
              {key.slice(0, 1)}
            </div>
            <div>
              <h4 className="font-heading text-muted-800 text-sm font-medium leading-tight dark:text-white">
                <span>{key}</span>
              </h4>
              <p className="font-alt text-xs font-normal leading-normal">
                <span className="text-muted-400">{value.length} 专业</span>
              </p>
            </div>
            <div className="ml-auto flex items-center">
              <Link 
              
              className="false false text-muted-700 border-muted-300 dark:bg-muted-700 dark:hover:bg-muted-600 dark:border-muted-600 hover:bg-muted-50 nui-focus relative inline-flex h-10 w-10 scale-75 items-center justify-center space-x-1 rounded-xl border bg-white p-2 font-sans text-sm font-normal leading-5 no-underline outline-none transition-all duration-300 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
            shallow
              href={{query:{
                ...params,
                department:key
              }}}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="icon h-5 w-5"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14m-7-7l7 7l-7 7"
                  ></path>
                </svg>
              </Link>
          
            </div>
          </div>
        );
      })}
    </div>
    <OffCanvas open={!!params.department} back={handleBack}>
      123
    </OffCanvas>
  </>;
}
