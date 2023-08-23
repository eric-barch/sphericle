import './globals.css'
import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'

const varelaRound = Varela_Round({ weight: ['400'], subsets: ['latin'] })

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
      <body className={varelaRound.className}>{children}</body>
    </html>
  )
}
