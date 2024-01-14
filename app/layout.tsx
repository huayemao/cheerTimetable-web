import '@/styles/globals.css'
import {
  APP_DESCRIPTION,
  APP_INTRODUCTION,
  APP_NAME,
  AUTHORS,
  KEY_WORDS
} from 'constants/siteConfig'
import CollectionProvider from 'contexts/collectionContext'
import LayoutProvider from 'contexts/layoutContext'
import PreferenceProvider from 'contexts/preferenceContext'
import { Metadata } from 'next'
import { BottomTab } from './BottomTab'

export const metadata: Metadata = {
  title: {
    default: APP_NAME + '——' + APP_DESCRIPTION,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_INTRODUCTION,
  keywords: KEY_WORDS,
  authors: AUTHORS,
  abstract: APP_INTRODUCTION,
  generator: 'Next.js',
  applicationName: APP_NAME,
  creator: AUTHORS[0].name,
  publisher: AUTHORS[0].name,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: [
    { url: '/icons/icon-48x48.png', type: 'image/png', sizes: '48x48' },
    { url: '/icons/icon-72x72.png', type: 'image/png', sizes: '72x72' },
    { url: '/icons/icon-96x96.png', type: 'image/png', sizes: '96x96' },
    { url: '/icons/icon-128x128.png', type: 'image/png', sizes: '128x128' },
    { url: '/icons/icon-144x144.png', type: 'image/png', sizes: '144x144' },
    { url: '/icons/icon-152x152.png', type: 'image/png', sizes: '152x152' },
    { url: '/icons/icon-192x192.png', type: 'image/png', sizes: '192x192' },
    { url: '/icons/icon-384x384.png', type: 'image/png', sizes: '384x384' },
    { url: '/icons/icon-512x512.png', type: 'image/png', sizes: '512x512' },
  ],
  themeColor: '#6d28d9',
}

export default function RootLayout({
  children,
  params,
}: {
  children: JSX.Element
  params: any
}) {
  return (
    <html lang="zh-Hans">
      <head>
        <meta name="baidu-site-verification" content="codeva-Lor1pIMEO8" />
        <script
          suppressHydrationWarning
          id="baidu-tongji"
          dangerouslySetInnerHTML={{
            __html: ` var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?2ee9d041f2af6093febf98f3134d4509";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();`,
          }}
        ></script>
      </head>
      <body>
        <LayoutProvider>
          <PreferenceProvider>
            <CollectionProvider>
              {children}
              <BottomTab />
            </CollectionProvider>
          </PreferenceProvider>
        </LayoutProvider>
      </body>
    </html>
  )
}
