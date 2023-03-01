'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'

export function NavLink() {
  const segments = useSelectedLayoutSegments()

  // 暂时只区分这两个
  const isCollection = segments[0] === 'collection'

  const items = [
    { href: '/collection', name: '收藏夹', isActive: isCollection },
    { href: '/', name: '课表查询', isActive: !isCollection },
  ]
  return (
    <ul className="space-y-1">
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
