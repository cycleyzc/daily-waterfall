module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js', '.json', '.vue']
    }
  },
  chainWebpack: config => {
    config.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .end()
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            unitToConvert: 'px',
            viewportWidth: 1280,
            viewportHeight: 800,
            unitPrecision: 4,
            viewportUnit: 'vw',
            fontViewportUnit: 'vw', // vmin is more suitable.
            selectorBlackList: [],
            minPixelValue: 2,
            mediaQuery: false
          })
        ]
      }
    }
  }
}
