import { Merriweather, Poppins, Raleway } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' })
const raleway = Raleway({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${raleway.className} p-5`} cz-shortcut-listen="true" suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}