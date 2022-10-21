const path = require('path')

module.exports = {
  publicPath: path.join(process.env.BASE_PATH, 'vue-uploader', '/'),
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
};
