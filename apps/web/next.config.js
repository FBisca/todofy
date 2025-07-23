import dotenv from 'dotenv'

const getEnv = () => {
  // eslint-disable-next-line no-undef
  if (process.env.APP_ENV === 'test') {
    const env = dotenv.config({ path: '.env.test' }).parsed

    return env
  }
  return {}
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: getEnv(),
  transpilePackages: ['@repo/ui'],
}

export default nextConfig
