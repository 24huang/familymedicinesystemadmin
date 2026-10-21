const proxyTarget = process.env.VUE_APP_DEV_PROXY_TARGET || 'http://localhost:81'

module.exports = {
  // 开发服务器配置
  devServer: {
    port: 3000, // 开发服务器端口
    proxy: {
      '/api': {
        target: proxyTarget, // 后端API地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      // 代理静态资源
      '/profile': {
        target: proxyTarget,
        changeOrigin: true
      },
      '/files': {
        target: proxyTarget,
        changeOrigin: true
      },
      '/common': {
        target: proxyTarget,
        changeOrigin: true
      }
    }
  },

  // 生产环境配置
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 输出目录
  outputDir: 'dist',

  // 静态资源目录
  assetsDir: 'static',

  // 是否保存时检查
  lintOnSave: process.env.NODE_ENV !== 'production',

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // Webpack 配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },

  // 链式配置
  chainWebpack: config => {
    // 设置页面标题
    config.plugin('html').tap(args => {
      args[0].title = '家庭药品管理系统'
      return args
    })
  }
}
