import Document, { Html, Head, Main, NextScript } from 'next/document'

const APP_NAME = '绮课-cheerTimetable'
const APP_DESCRIPTION = '中南大学本科生课表查询工具。根据学生姓名、教师姓名、教室名称查询课表，同时支持查询课程的上课学生列表。'
const AUTHOR = '花野猫'
const KEY_WORDS = '绮课,中南大学,本科生,课表,课程表,数字花园'
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
          <meta name="description" content={APP_DESCRIPTION} />
          <meta name="author" content={AUTHOR} />
          <meta name="keywords" content={KEY_WORDS} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />
          {/* TIP: set viewport head meta tag in _app.js, otherwise it will show a warning */}
          {/* <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' /> */}

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="manifest" href="/manifest.json" />
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?d0e515e7bc73e3a62f0078cc9783e9ab";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })(); 
              `,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
