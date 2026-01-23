module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 替换为你的后端地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}