const Path = require('path');
const { DefinePlugin } = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractPostCss = new ExtractTextPlugin('css/[name].css');
const Html = require('html-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const WebpackPlugin = require('./webpack.plugin');

module.exports = {
  output: {
    path: Path.resolve(__dirname, '../build'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint-loader', enforce: 'pre' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', options: { cacheDirectory: 'cache' } },
      { test: /\.css$/, loader: ExtractPostCss.extract({ use: ['css-loader', 'postcss-loader'], publicPath: '/' }) },
      { test: /\.(svg|jpg|png|gif)$/, loader: 'file-loader', options: { name: 'images/[name].[ext]' } },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: { name: 'fonts/[name].[ext]', limit: 5000, mimetype: 'application/font-woff' }
      },
      { test: /\.ttf$|\.eot$/, loader: 'file-loader', options: { name: 'fonts/[name].[ext]' } }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new WebpackPlugin({
      clean: ['build', 'cache', 'coverage']
    }),
    new DefinePlugin({
      'DEBUG': JSON.stringify(!!process.env.DEBUG),
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    ExtractPostCss,
    new Html({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new Copy([
      { from: './src/favicon.ico', to: './' },
      { from: './src/vendor/', to: './vendor' },
    ])
  ]
};
