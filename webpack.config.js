const path = require('path')
const ROOT_DIRECTORY = process.cwd()
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin')

module.exports = {
  entry : path.resolve(ROOT_DIRECTORY, 'src/js/app.js'),
  output : {
    path : path.resolve(ROOT_DIRECTORY, 'dist'),
    filename : 'js/[name].js',
    chunkFilename : 'js/[name].bundle.js',
    publicPath: '/'
  },
  devServer : {
    historyApiFallback : true,
    contentBase : path.resolve(ROOT_DIRECTORY, 'dist'),
  },
  module : {
    rules : [
      {
        test : /\.jsx$|\.es6$|\.js$/,
        loader : 'babel-loader',
        exclude : /node_modules/,
        options: {
          cacheDirectory: true,
        }
      },
    ],
  },
  devtool : 'source-map',
  optimization : {
    moduleIds : 'hashed',
    runtimeChunk : 'single',
    splitChunks : {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 20,
      maxInitialRequests: 20,
      name: true,
      cacheGroups : {
        vendor : {
          test : /[\\/]node_modules[\\/]/,
          name : 'vendors',
          chunks : 'all',
        },
      },
    },
    // minimize : true,
    // minimizer : [
    //   new TerserPlugin({
    //     test : /\.js(\?.*)?$/i,
    //     terserOptions : {
    //       output : {
    //         comments : false,
    //       },
    //     },
    //     parallel : true,
    //     cache : true,
    //     extractComments : false,
    //   }),
    // ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(ROOT_DIRECTORY, './src/index.html'),
    }),
    new ScriptExtHtmlWebpackPlugin({
      sync: ['runtime.js', 'vendors.bundle.js'],
      defer: 'main.bundle',
      prefetch: ['runtime.js', 'vendors.bundle.js'],
      defaultAttribute: 'async'
    }),
    new ResourceHintWebpackPlugin()
  ],
}