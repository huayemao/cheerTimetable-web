import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PreferenceProvider from 'contexts/preferenceContext'
import CollectionProvider from 'contexts/collectionContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PreferenceProvider {...pageProps}>
      <CollectionProvider {...pageProps}>
        <Component {...pageProps} />
      </CollectionProvider>
    </PreferenceProvider>
  )
}

export default MyApp
