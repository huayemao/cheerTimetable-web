'use client'

export default function HeaderTitle({}) {
  if (document.title.includes('——')) {
    const [title, sub] = document.title.replace('。', '').split('——')
    return (
      <>
        {title}
        {'  '}
        <sub className="text-xs md:text-sm">{sub}</sub>
      </>
    )
  }
  return <>{document.title.split(' | ')[0]}</>
}
