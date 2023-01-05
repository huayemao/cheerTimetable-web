import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PreferenceProvider from 'contexts/preferenceContext'
import CollectionProvider from 'contexts/collectionContext'
import { NewLayout } from "components/common/NewLayout"

// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <PreferenceProvider {...pageProps}>
      <CollectionProvider {...pageProps}>
        <NewLayout {...pageProps} router={router}>
          <Component {...pageProps} />
        </NewLayout>
      </CollectionProvider>
    </PreferenceProvider>
  )
}

export default MyApp
