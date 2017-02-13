const path = require('path')

const PROJECT_ROOT = __dirname
const SRC_DIR = PROJECT_ROOT + '/src'
const BUILD_DIR = PROJECT_ROOT + '/dist'

module.exports = (() => {
  return {
    context: path.resolve('src'),
    entry: './app.js',
    output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
      publicPath: '/dist/',
    },
    devServer: {
      contentBase: SRC_DIR,
      historyApiFallback: {
        index: './index.html'
      }
    },
    devtool: 'eval',
    resolve: {
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
        'react-addons-css-transition-group': 'rc-css-transition-group'
      }
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          include: [
            path.resolve(__dirname, "src")
          ],
          exclude: [
            path.resolve(__dirname, "node_modules")
          ],
          loader: "babel-loader",
          options: {
            presets: [['babel-preset-es2015', {
              "modules": false
            }], 'react', 'babel-preset-stage-2']
          }
        },{
          test: /\.less$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'less-loader'
          ]
        }
      ]
    }
  }
})()
