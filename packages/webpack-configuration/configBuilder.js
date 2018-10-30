const merge = require('webpack-merge');
const devBuilder = require('./devBuilder.js');
const prodBuilder = require('./prodBuilder.js');

const { env } = require('yargs').argv;


const configBuilder = (ROOT_DIR, LIBRARY_NAME, EXTERNAL_MERGE = {}) => {
  let config = null;

  switch (env) {
    case 'prod':
    case 'production': {
      process.env.NODE_ENV = 'production';
      config = merge(prodBuilder(ROOT_DIR, LIBRARY_NAME), EXTERNAL_MERGE.prod);
      break;
    }

    case 'dev':
    case 'development': {
      process.env.NODE_ENV = 'development';
      config = merge(devBuilder(ROOT_DIR, LIBRARY_NAME), EXTERNAL_MERGE.dev);
      break;
    }

    default: throw Error('Hasn\'t suitable configuration');
  }

  return config;
};

module.exports = configBuilder;
