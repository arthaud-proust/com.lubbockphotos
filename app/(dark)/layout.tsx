import { Layout } from '@/components/Layout'

export default function DarkLayout({ children }) {
  return <Layout isBgDark={true}>{children}</Layout>
}
