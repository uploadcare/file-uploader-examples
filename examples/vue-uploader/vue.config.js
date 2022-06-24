module.exports = {
  publicPath: "/uc-blocks-examples/vue-uploader/",
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
