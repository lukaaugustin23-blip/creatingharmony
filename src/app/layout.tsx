import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — CreatingHarmony',
    default: 'CreatingHarmony — Agency OS',
  },
  description:
    'Precision and harmony across your team. One system for finances, leads, projects, and invoicing.',
  metadataBase: new URL('https://creatingharmony.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-body antialiased bg-obsidian-bg text-obsidian-text">
        {children}
      </body>
    </html>
  )
}
