const { PHASE_PRODUCTION_BUILD } = require('next/constants')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: `${process.env.BASE_PATH || '/'}next-uploader/regular`
};

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    return nextConfig
  }

  return {};
}
