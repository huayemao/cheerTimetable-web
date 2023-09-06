import Document, { Head, Html, Main, NextScript } from 'next/document'
import { APP_NAME } from '../constants/siteConfig'

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    return await Document.getInitialProps(ctx)
  }

  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>绮课</title>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />
          {/* TIP: set viewport head meta tag in _app.js, otherwise it will show a warning */}
          {/* <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' /> */}

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <style>{`
            html, body, #__next {
              height: 100%;
            }
            #__next {
              margin: 0 auto;
            }
            h1 {
              text-align: center;
            }
            `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
