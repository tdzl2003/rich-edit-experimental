/**
 * Created by DengYun on 2017/7/14.
 */

global.__DEV__ = (process.env.WEBPACK_ENV) !== 'production';

const webpack = require('webpack');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: __DEV__ ? "bundle.js" : 'bundle.[hash].js'
  },

  resolve: {
    alias: {
      'react-rich-edit': path.resolve(__dirname, 'src/react-rich-edit'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Rich Edit',
      minify: {
        collapseWhitespace: true
      },
      template: './src/index.ejs'
    }),
    new ExtractTextPlugin({ filename: __DEV__ ? '[name].css' : '[hash].css', allChunks: true }),
    new webpack.DefinePlugin({
      __DEV__,
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: __DEV__ ? JSON.stringify('development') : JSON.stringify('production'),
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.scss$/,

        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:[
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: __DEV__ ? '[name]-[local]--[hash:base64:5]' : '[hash:base64:8]',
              }
            }, {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  devServer: {
    compress: true,
    port: 8082,
    stats: "errors-only",
    publicPath: '/',
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: '/',
    hot: true,
  },

  devtool: "source-map",
}
