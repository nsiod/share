import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
})

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // images: {
  //   unoptimized: true,
  // },
}

export default withNextIntl(nextConfig)
