const { PHASE_PRODUCTION_BUILD } = require('next/constants');

// Strip the trailing slash, if any — Next expects a leading-slash basePath
// without a trailing slash. The build-pages script passes
// "/file-uploader-examples/next-uploader/" so we normalize here.
const rawBase = process.env.BASE_PATH ?? '';
const basePath = rawBase.replace(/\/$/, '');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    return nextConfig;
  }

  return {};
};
