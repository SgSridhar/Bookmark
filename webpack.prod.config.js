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
    devtool: 'source-map',
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
            path.resolve(__dirname, "src"),
            path.resolve('node_modules/preact-compat/src')
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
