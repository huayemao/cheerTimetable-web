import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PreferenceProvider from 'contexts/preferenceContext'
import CollectionProvider from 'contexts/collectionContext'

// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <PreferenceProvider {...pageProps}>
      <CollectionProvider {...pageProps}>
          <Component {...pageProps} />
      </CollectionProvider>
    </PreferenceProvider>
  )
}

export default MyApp
