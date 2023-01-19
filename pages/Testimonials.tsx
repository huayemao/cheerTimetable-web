import Layout from 'components/common/Layout'
import { Quote as IconQuote } from 'components/Icons'
import { getSentences } from 'lib/service/getSentences'
import React from 'react'

type Props = {
  sentences: any[]
}

export default function Testimonials({ sentences }: Props) {
  return (
    <Layout title={'Testimonial'}>
      <div className="grid gap-6 p-8 md:grid-cols-2">
        {sentences.map((e) => (
          <blockquote
            key={e.sentence}
            className="flex flex-col-reverse gap-4 rounded-lg p-6 shadow"
          >
            <h4 className="text-right text-gray-600">{e.nickName}</h4>
            <p className="flex">
              <IconQuote className="left-2 mr-2 h-5 w-5 fill-current text-blue-600"></IconQuote>
              {e.sentence}
            </p>
          </blockquote>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const sentences = await getSentences()

  return {
    props: {
      sentences,
    },
    revalidate: 30,
  }
}
