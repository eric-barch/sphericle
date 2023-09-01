import TopNavigation from '@/components/TopNavigation'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import '@/styles/globals.css'

const font = Nunito({ weight: ['400'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'globle',
  description: 'A geography learning aid powered by Google Maps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <TopNavigation />
        <main>
          {children}
        </main>
      </body>
    </html >
  )
}