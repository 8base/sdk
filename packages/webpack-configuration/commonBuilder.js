const path = require('path');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

const commonBuilder = (ROOT_DIR, LIBRARY_NAME) => ({
  entry: `${ROOT_DIR}/src/index.js`,
  devtool: 'source-map',
  output: {
    path: `${ROOT_DIR}/lib`,
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
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    modules: [path.resolve(ROOT_DIR, './node_modules'), path.resolve(ROOT_DIR, './src')],
    extensions: ['.json', '.js', '.mjs'],
  },
  plugins: [
    new PeerDepsExternalsPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  externals: {},
  node: {
    fs: 'empty',
    tls: 'empty',
  },
});

module.exports = commonBuilder;
