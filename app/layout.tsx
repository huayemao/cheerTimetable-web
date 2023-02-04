import { NewLayout } from '@/components/common/NewLayout'
import '@/styles/globals.css'
import CollectionProvider from 'contexts/collectionContext'
import LayoutProvider from 'contexts/layoutContext'
import PreferenceProvider from 'contexts/preferenceContext'
import { BottomTab } from './BottomTab'

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
              <NewLayout>
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
