const { configBuilder } = require('@8base/webpack-configuration');

const LIBRARY_NAME = 'utils';

const externals = {
  '@8base/sdk': '@8base/sdk',
  ramda: 'ramda',
};

module.exports = configBuilder(__dirname, LIBRARY_NAME, {
  prod: {
    externals,
  },
  dev: {
    externals,
  },
});
