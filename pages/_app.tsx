import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PreferenceProvider from 'contexts/preferenceContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PreferenceProvider {...pageProps}>
      <Component {...pageProps} />
    </PreferenceProvider>
  )
}

export default MyApp
