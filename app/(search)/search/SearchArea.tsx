'use client'
import React from 'react';
import Search from '@/components/Search';
import { useRouter } from 'next/navigation';

export const SearchArea = () => {
  const router = useRouter();
  return (
    <Search
      wrapperClassName={'m-4'}
      iconClassName={'text-slate-400'}
      className=" rounded text-sm ring-1 ring-slate-300 focus:ring-blue-400"
      onSubmit={(v) => router.push(`/search?query=${v}`)}
      placeholder={'搜索'} />
  );
};
