import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Watch Flipping Business Manager',
  description: 'Manage your watch resale business with AI-powered insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

