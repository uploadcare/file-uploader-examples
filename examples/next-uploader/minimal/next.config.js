const { PHASE_PRODUCTION_BUILD } = require('next/constants')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
};

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    return nextConfig
  }

  return {};
}
