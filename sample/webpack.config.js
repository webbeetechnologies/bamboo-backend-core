const path = require('path'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  webpack = require('webpack');

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000000000000000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  entry: {
    worker: './src/worker.ts',
  },

  output: {
    path: path.resolve(__dirname, 'graphiql/build'),
    filename: '[name].js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
              plugins: ['dynamic-import-webpack', 'remove-webpack'],
            },
          },
        ],
      },
      /*{
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['dynamic-import-webpack', 'remove-webpack'],
            },
          },
        ],
      },*/
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: false,
      fs: false,
      path: false,
      'react-native-sqlite-storage': false,
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'graphiql/build'),
    },
    port: 9000,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'graphiql/build/worker.js'),
          to: path.resolve(__dirname, 'graphiql/public'),
        },
      ],
    }),
    /* new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),*/
  ],
};
