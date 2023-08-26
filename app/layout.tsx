import NavBar from '@/components/NavBar'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

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
      <body className={font.className + ' flex flex-col min-h-screen'}>
        <NavBar />
        <main className='flex flex-col flex-grow'>
          {children}
        </main>
      </body>
    </html>
  )
}