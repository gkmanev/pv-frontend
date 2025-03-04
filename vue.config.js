module.exports = {
  publicPath: "/",
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@use "sass:meta"; @warn "Suppressing Sass warnings";',
      },
    },
  },
};
