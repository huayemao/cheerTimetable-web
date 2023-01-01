import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PreferenceProvider from 'contexts/preferenceContext'
import CollectionProvider from 'contexts/collectionContext'
import { NewLayout } from 'components/common/Layout'

// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps, router }: AppProps) {
  const shouldIgnoreNewLayout = !['/search', '/schedule'].some((e) =>
    router.pathname.includes(e)
  )

  return (
    <PreferenceProvider {...pageProps}>
      <CollectionProvider {...pageProps}>
        <NewLayout {...pageProps} ignore={shouldIgnoreNewLayout}>
          <Component {...pageProps} />
        </NewLayout>
      </CollectionProvider>
    </PreferenceProvider>
  )
}

export default MyApp
