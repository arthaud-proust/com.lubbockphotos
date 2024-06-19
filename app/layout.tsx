import { Layout } from '@/components/Layout'
import '@/global.css'
import { seo } from '@/seo'

export const metadata = {
  title: seo.title,
  description: seo.description,
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
