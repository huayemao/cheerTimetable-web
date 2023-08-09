import {
  APP_DESCRIPTION,
  APP_NAME
} from 'constants/siteConfig'

export default function Head() {
  return (
    <>
      <title>{APP_NAME}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="description" content={APP_DESCRIPTION} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#FFFFFF" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}
