import React from 'react'

type Props = {
  content: string
}

export default function Empty({ content }: Props) {
  return (
    <div>
      <div
        className="flex h-96 w-96 items-center justify-center"
        style={{
          backgroundSize: '105%',
          backgroundImage:
            'url(/svgs/sssplatter.svg)',
        }}
      >
        <h3 className="text-center text-sm  leading-5 text-gray-700 sm:text-lg">
          {content}
        </h3>
      </div>
    </div>
  )
}
