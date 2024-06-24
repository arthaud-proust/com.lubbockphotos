import { Layout } from '@/components/Layout'

export default function LightLayout({ children }) {
  return <Layout isBgDark={false}>{children}</Layout>
}
