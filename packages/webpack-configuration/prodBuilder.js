const merge = require('webpack-merge');
const commonBuilder = require('./commonBuilder.js');


const prodBuilder = (ROOT_DIR, LIBRARY_NAME) => {
  const common = commonBuilder(ROOT_DIR, LIBRARY_NAME);
  const outputFile = `${LIBRARY_NAME}.js`;

  return merge(common, {
    mode: 'production',
    output: {
      filename: outputFile,
    },
    optimization: {
      minimize: false,
    },
  });
};

module.exports = prodBuilder;
