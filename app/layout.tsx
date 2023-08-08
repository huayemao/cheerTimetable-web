import { NewLayout } from '@/components/common/NewLayout'
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
  title: APP_NAME + '——' + APP_DESCRIPTION,
  description: APP_INTRODUCTION,
  keywords: KEY_WORDS,
  authors: AUTHORS,
  abstract: APP_INTRODUCTION,
}

export default function RootLayout({
  children,
  params,
}: {
  children: JSX.Element
  params: any
}) {
  return (
    <html>
      <head />
      <body>
        <LayoutProvider>
          <PreferenceProvider>
            <CollectionProvider>
              <NewLayout params={params}>
                {children}
                <BottomTab />
              </NewLayout>
            </CollectionProvider>
          </PreferenceProvider>
        </LayoutProvider>
      </body>
    </html>
  )
}
