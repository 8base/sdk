const merge = require('webpack-merge');
const commonBuilder = require('./commonBuilder.js');


const devBuilder = (ROOT_DIR, LIBRARY_NAME) => {
  const common = commonBuilder(ROOT_DIR, LIBRARY_NAME);
  const outputFile = `${LIBRARY_NAME}.js`;

  return merge(common, {
    mode: 'development',
    output: {
      filename: outputFile,
    },
  });
};

module.exports = devBuilder;
