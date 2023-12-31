import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AOSInit } from './aos'

const poppins = Poppins({ subsets: ['devanagari'], weight: "300" })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AOSInit />
      <body className={`w-screen ${poppins.className}`}>
        {children}
      </body>
    </html>
  )
}
