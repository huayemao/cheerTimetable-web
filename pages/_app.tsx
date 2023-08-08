import '@/styles/globals.css'
import CollectionProvider from 'contexts/collectionContext'
import PreferenceProvider from 'contexts/preferenceContext'
import type { AppProps } from 'next/app'

// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps, router }) {
  return (
    <PreferenceProvider {...pageProps}>
      <CollectionProvider {...pageProps}>
          <Component {...pageProps} />
      </CollectionProvider>
    </PreferenceProvider>
  )
}

export default MyApp
