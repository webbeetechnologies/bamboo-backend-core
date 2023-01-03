const path = require('path'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      worker: './src/worker.ts',
    },

    output: {
      asyncChunks: false,
      chunkFormat: 'array-push',
      chunkLoading: 'import-scripts',
      path: path.resolve(__dirname, 'graphiql/build'),
      filename: '[name].js',
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval-source-map',
    watch: !isProduction,
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
              },
            },
          ],
        },
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
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
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
    ].filter(Boolean),
  };
};
