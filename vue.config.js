const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/': {
        ws: false,
        target: 'http://localhost:8888',
        changeOrigin: true,//±Ì æ «∑ÒøÁ”Ú
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
})


