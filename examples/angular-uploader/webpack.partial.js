module.exports = {
  module: {
    rules: [
      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
      {
        resourceQuery: /url/,
        type: 'asset/resource',
      }
    ]
  }
};
