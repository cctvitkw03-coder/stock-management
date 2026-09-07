import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stock & Asset Management | ระบบบริหารสต๊อกและอุปกรณ์',
  description: 'ระบบบริหารสต๊อกและอุปกรณ์ ติดตามการรับเข้า เบิกจ่าย คืน โอนย้าย และซ่อมบำรุง',
  keywords: 'stock management, asset management, inventory, สต๊อก, อุปกรณ์',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
