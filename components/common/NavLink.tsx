'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLUListElement> {}

export function NavLink({ className }: Props) {
  const segments = useSelectedLayoutSegments()

  const items = [
    { href: '/', name: '主页', isActive: !segments[0] },
    {
      href: '/collection',
      name: '收藏夹',
      isActive: segments[0] === 'collection',
    },
    { href: '/about', name: '关于', isActive: segments[0] === 'about' },
  ]
  return (
    <ul className={clsx('space-y-1', className)}>
      {/* todo: 这里加一个搜索框 */}
      {items.map(({ href, name, isActive }) => (
        <li
          key={name}
          className={clsx(
            'rounded transition-all hover:scale-[102%] hover:bg-slate-100',
            {
              'bg-slate-100': isActive,
            }
          )}
        >
          <Link href={href} className="inline-block w-full px-4 py-2">
            {name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
