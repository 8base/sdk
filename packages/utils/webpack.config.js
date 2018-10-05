/* eslint-disable */

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;

const LIBRARY_NAME = 'utils';

let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = `${LIBRARY_NAME}.min.js`;
} else {
  mode = 'development';
  outputFile = `${LIBRARY_NAME}.js`;
}

const config = {
  mode,
  entry: `${__dirname}/src/index.js`,
  devtool: 'source-map',
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: LIBRARY_NAME,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  externals: {
    'ramda': 'ramda',
  }
};

module.exports = config;
