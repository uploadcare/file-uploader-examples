const path = require('path')

module.exports = {
  publicPath: process.env.BASE_PATH ? path.join(process.env.BASE_PATH, 'vue-uploader', '/') : '',
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: (tag) => tag.startsWith("lr-"),
        };
        return options;
      });
  },
  devServer: {
    disableHostCheck: true,
  },
};
